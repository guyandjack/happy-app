# Get all JSX files
$files = Get-ChildItem -Path "my-website\src\components" -Recurse -Filter "*.jsx"

# Process each file
foreach ($file in $files) {
    Write-Host "Processing $($file.Name)"
    
    # Read file content
    $content = Get-Content -Path $file.FullName -Raw
    
    # Keep original for comparison
    $originalContent = $content
    
    # Update CSS imports
    $content = $content -replace 'import\s+["'']../../styles/([^"'']+)["'']', 'import "@styles/$1"'
    
    # Only write to file if changes were made
    if ($content -ne $originalContent) {
        Write-Host "  Updated CSS imports in $($file.Name)"
        Set-Content -Path $file.FullName -Value $content
    } else {
        Write-Host "  No changes needed in $($file.Name)"
    }
}

Write-Host "CSS import path updates completed." 