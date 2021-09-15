
module.exports.core = {
	success: { responseCode: "LTR-200", responseMessage: "Success" },
	login_failed: { responseCode: "LTR-1001", responseMessage: "Username or Password is incorrect." },
	session_timeout: { responseCode: "LTR-1002", responseMessage: "Session timeout." },
	token_expire: { responseCode: "LTR-1003", responseMessage: "Token expire." },
	validate_error: { responseCode: "LTR-1004", responseMessage: "Invalid input." },
	no_data_found: { responseCode: "LTR-1005", responseMessage: "No data found." },
	already_login: { responseCode: "LTR-1006", responseMessage: "This user is already login." },
	invalid_token: { responseCode: "LTR-1007", responseMessage: "Invalid Token." }
}

module.exports.agent = {
	duplicate_user: { responseCode: "LTR-2101", responseMessage: "Username หรือ Email ของ Agent มีอยู่แล้วในระบบ" },
	not_found_user: { responseCode: "LTR-2102", responseMessage: "ไม่พบข้อมูล Agent" },
	credit_not_enough: { responseCode: "LTR-2103", responseMessage: "ไม่สามาทำรายการได้ เนื่องจากเครดิตไม่เพียงพอ" }
};

module.exports.owner = {
	duplicate_user: { responseCode: "LTR-2201", responseMessage: "Playername or Username is already in use." },
	// msg1: {responseCode:"LTR-2201",responseMessage:"example message1"},
	msg2: { responseCode: "LTR-2202", responseMessage: "example message2" },
	msg3: { responseCode: "LTR-2203", responseMessage: "example message3" }
};

module.exports.player = {
	duplicate_player: { responseCode: "LTR-2301", responseMessage: "Player Name หรือ Username มีอยู่แล้วในระบบ" },
	msg2: { responseCode: "LTR-2302", responseMessage: "example message2" },
	msg3: { responseCode: "LTR-2303", responseMessage: "example message3" }
};

module.exports.employee = {
	msg1: { responseCode: "LTR-3101", responseMessage: "example message1" },
	msg2: { responseCode: "LTR-3102", responseMessage: "example message2" },
	msg3: { responseCode: "LTR-3103", responseMessage: "example message3" }
};

module.exports.pomotion = {
	msg1: { responseCode: "LTR-3201", responseMessage: "example message1" },
	msg2: { responseCode: "LTR-3202", responseMessage: "example message2" },
	msg3: { responseCode: "LTR-3203", responseMessage: "example message3" }
};