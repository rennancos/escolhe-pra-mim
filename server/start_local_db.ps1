$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe"
$dataDir = "$PSScriptRoot\mysql_data"

if (Test-Path $mysqlPath) {
    Write-Host "Iniciando MySQL Server na porta 3307..."
    Write-Host "Data Directory: $dataDir"
    & $mysqlPath --console --port=3307 --datadir="$dataDir"
} else {
    Write-Host "Executável do MySQL não encontrado em: $mysqlPath" -ForegroundColor Red
}
