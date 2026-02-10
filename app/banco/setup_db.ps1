$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe"
$sqlFile = "$PSScriptRoot\mybank.sql"

if (Test-Path $mysqlPath) {
    Write-Host "Conectando ao MySQL e importando o banco de dados..."
    & $mysqlPath -u root -e "source $sqlFile"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Banco de dados configurado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "Erro ao importar o banco de dados." -ForegroundColor Red
    }
} else {
    Write-Host "Executável do MySQL não encontrado em: $mysqlPath" -ForegroundColor Red
    Write-Host "Por favor, verifique o caminho da instalação do MySQL."
}
