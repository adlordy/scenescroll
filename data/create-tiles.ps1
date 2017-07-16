param(
    $videoId = "139",
    $threshold = "0.25"
)

$videoFile = ".\Videos\2\20170714\$videoId.mp4"

mkdir -Path ".\tiles\$videoId" -ErrorAction Ignore > $null
mkdir -Path ".\thumbnails\$videoId" -ErrorAction Ignore > $null

ffmpeg -hide_banner -loglevel error -i $videoFile `
    -qscale:v 2 ".\thumbnails\$videoId\%05d.jpg" -y

$info = ffprobe -v quiet -print_format json -show_streams -select_streams 0 $videoFile `
    | ConvertFrom-Json `
    | ForEach-Object { 
    $_.streams[0] `
        | Select-Object width, height, r_frame_rate, duration, nb_frames
}

$frames = ffmpeg -hide_banner -loglevel info -i $videoFile `
    -filter:v "select='gt(scene,$threshold)',showinfo"  -f null - 2>&1 `
    | Select-String -Pattern "pts_time:(\d+.\d+)" -AllMatches `
    | ForEach-Object {[Math]::Ceiling(25 * [float]$_.Matches.Groups[1].Value) } `
    | ForEach-Object -Begin {
        $last = 0
    } { 
        $item = New-Object -TypeName psobject -Property @{start = $last; stop = $_}; 
        $last = $_; 
        $item
    } -End {
        New-Object -TypeName psobject -Property @{start = $last; stop = [int]$info.nb_frames}
    }

$info | Add-Member NoteProperty -Name "frames" -Value $frames -PassThru `
    | ConvertTo-Json `
    | Set-Content ".\info\$videoId.json"


$files = Get-ChildItem ".\thumbnails\$videoId\" `
     | Select-Object -ExpandProperty FullName

$frames | ForEach-Object {
        $groupSize = 250
        $counter = [pscustomobject] @{ Value = 0 }
        $files[$_.start..$($_.stop-2)] `
            | Group-Object -Property { [Math]::Floor($counter.Value++ / $groupSize) } `
            | ForEach-Object { [String]::Join(" ", $_.Group) }
    } `
    | ForEach-Object -begin {$i=0 } {
        $("magick montage {0} -mode concatenate -tile 1x .\tiles\{2}\tile-{1:d2}.jpg" -f $_,$i,$videoId); $i=$i+1 
    } `
    | ForEach-Object{ Invoke-Expression $_ }
