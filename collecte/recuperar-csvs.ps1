$ErrorActionPreference = 'Stop'
$dataRoot = Join-Path (Split-Path -Parent $PSScriptRoot) 'data'
$configuration = Get-Content -Raw -LiteralPath (Join-Path $dataRoot '.collector-local.json') | ConvertFrom-Json
$key = [Net.NetworkCredential]::new('', (ConvertTo-SecureString -String $configuration.admin_protected)).Password
$headers = @{ 'X-Collector-Key' = $key }
$encoding = [Text.UTF8Encoding]::new($false)
$participants = [Collections.Generic.List[object]]::new()
$total = 0
$after = ''

function Format-SpreadsheetText([string]$value) {
    if ($value -match '^\s*[=+\-@]') { return "'" + $value }
    return $value
}

do {
    $address = $configuration.endpoint
    if ($after) { $address += '?after=' + [uri]::EscapeDataString($after) }
    $page = Invoke-RestMethod -Uri $address -Headers $headers -TimeoutSec 20
    foreach ($result in $page.results) {
        if ($result.file_name -notmatch '^sternberg-(pilot|study)-(presentiel|distance)-(digits|symbols)-[0-9a-f-]{36}\.csv$') {
            throw 'Nome de arquivo inesperado recebido pelo coletor.'
        }
        if ($result.email) {
            $participants.Add([pscustomobject]@{
                session_id = $result.session_id
                nome = Format-SpreadsheetText $result.name
                email = Format-SpreadsheetText $result.email
                email_repetido = if ($result.repeated_email) { 'sim' } else { 'não' }
            })
        }
        $folder = if ($result.file_name.StartsWith('sternberg-pilot-')) { 'piloto' } else { 'coleta' }
        $destination = Join-Path $dataRoot $folder
        New-Item -ItemType Directory -Path $destination -Force | Out-Null
        $path = Join-Path $destination $result.file_name
        if (!(Test-Path -LiteralPath $path)) {
            $temporary = Join-Path $destination ([guid]::NewGuid().ToString() + '.tmp')
            try {
                [IO.File]::WriteAllText($temporary, $result.csv_text, $encoding)
                [IO.File]::Move($temporary, $path)
                $total++
            } catch [IO.IOException] {
                if (!(Test-Path -LiteralPath $path)) { throw }
            } finally {
                if (Test-Path -LiteralPath $temporary) { Remove-Item -LiteralPath $temporary }
            }
        }
    }
    $after = $page.next
} while ($after)

if ($participants.Count) {
    $identityFolder = Join-Path $dataRoot 'identificacao'
    New-Item -ItemType Directory -Path $identityFolder -Force | Out-Null
    $register = Join-Path $identityFolder 'participantes.tsv'
    $temporary = Join-Path $identityFolder ([guid]::NewGuid().ToString() + '.tmp')
    try {
        $participants | Export-Csv -LiteralPath $temporary -Delimiter "`t" -Encoding utf8BOM -NoTypeInformation
        [IO.File]::Move($temporary, $register, $true)
    } finally {
        if (Test-Path -LiteralPath $temporary) { Remove-Item -LiteralPath $temporary }
    }
    $repeated = @($participants | Where-Object email_repetido -eq 'sim').Count
    Write-Output "$($participants.Count) identificação(ões) em $register. $repeated sessão(ões) com e-mail repetido."
}

Write-Output "$total novo(s) CSV(s) salvo(s)."
