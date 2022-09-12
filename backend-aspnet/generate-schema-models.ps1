Param(
    [string]$Source = "local"
)
[string]$conn=""

function GetConnectionString() {

    switch ( $Source )
    {
        "local" {
            $db_host="localhost"
            return "server=$db_host;port=3306;uid=root;pwd=12345678;database=todo;TreatTinyAsBoolean=False"
        }
        "prod" {
            $db_host="localhost"
            return "server=$db_host;port=3306;uid=root;pwd=12345678;database=todo"
        }
        default {
            Write-Host "'$Source' is invalid Source"
            exit
        }
    }
}

function Scaffold() {
    $conn = GetConnectionString
    if ( -Not $conn )
    {
        Write-Host "Invalid Connection"
        return
    }

    #Write-Host $conn
    Scaffold-DbContext "$conn" Pomelo.EntityFrameworkCore.MySql -v -f -Project todo -DataAnnotations -NoOnConfiguring -NoPluralize -OutputDir "Entity" -Context "TodoDbContext"
}

Scaffold