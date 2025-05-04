# Get all JSX files
$files = Get-ChildItem -Path "my-website\src\components" -Recurse -Filter "*.jsx"

# Process each file
foreach ($file in $files) {
    Write-Host "Processing $($file.Name)"
    
    # Read file content
    $content = Get-Content -Path $file.FullName -Raw
    
    # Keep original for comparison
    $originalContent = $content
    
    # Update imports
    # Utils imports
    $content = $content -replace 'from\s+["'']../../utils/([^"'']+)["'']', 'from "@utils/$1"'
    
    # Styles imports
    $content = $content -replace 'from\s+["'']../../styles/([^"'']+)["'']', 'from "@styles/$1"'
    
    # Assets imports
    $content = $content -replace 'from\s+["'']../../assets/([^"'']+)["'']', 'from "@assets/$1"'
    
    # Components imports
    $content = $content -replace 'from\s+["'']../../components/([^"'']+)["'']', 'from "@components/$1"'
    
    # Relative component imports (../)
    $content = $content -replace 'from\s+["'']../([A-Za-z0-9]+)/([^"'']+)["'']', 'from "@components/$1/$2"'
    
    # Only write to file if changes were made
    if ($content -ne $originalContent) {
        Write-Host "  Updated imports in $($file.Name)"
        Set-Content -Path $file.FullName -Value $content
    } else {
        Write-Host "  No changes needed in $($file.Name)"
    }
}

Write-Host "Import path updates completed."
