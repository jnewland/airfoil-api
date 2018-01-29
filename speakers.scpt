tell application "Airfoil"
	set myspeakers to get every speaker
	set allSpeakers to {}
	repeat with currentSpeaker in myspeakers
		set thisSpeaker to {}
		set conn to connected of currentSpeaker
		copy conn to the end of thisSpeaker
		set volum to volume of currentSpeaker
		copy volum to the end of thisSpeaker
		set nm to name of currentSpeaker
		copy nm to the end of thisSpeaker
		set spkId to id of currentSpeaker
		copy spkId to the end of thisSpeaker
		set AppleScript's text item delimiters to ","
		set speakerText to thisSpeaker as text
		set AppleScript's text item delimiters to ""
		copy speakerText to the end of allSpeakers
	end repeat
	set AppleScript's text item delimiters to "|"
	set speakerText to allSpeakers as text
	set AppleScript's text item delimiters to ""
	get speakerText
end tell
