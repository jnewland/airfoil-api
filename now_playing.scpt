tell application "Airfoil Satellite"
	if is connected then
		get artist & "|" & album & "|" & track title
	else
		get ""
	end if
end tell
