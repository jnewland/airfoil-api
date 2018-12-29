tell application "Airfoil"
	set listOfDevices to name of every application source
	set listOfDevices2 to name of every device source
	set listOfDevices3 to name of every system source
	set AppleScript's text item delimiters to ","
	set deviceText to listOfDevices & listOfDevices2 & listOfDevices3 as text
	get deviceText
end tell
