
module.exports.core = {
	success:{code:"LTR-200",message:"Success"},
	login_failed:{code:"LTR-1001",message:"Username or password is incorrect."},
	session_timeout:{code:"LTR-1002",message:"Session timeout."},
	token_expire:{code:"LTR-1003",message:"Token expire."},
	validate_error:{code:"LTR-1004",message:"Invalid input."},
	no_data_found:{code:"LTR-1005",message:"No data found."}
}

module.exports.agent = {
	duplicate_user: {code:"LTR-2101",message:"Username หรือ Email ของ Agent มีอยู่แล้วในระบบ"},
	not_found_user: {code:"LTR-2102",message:"ไม่พบข้อมูล Agent"},
	credit_not_enough: {code:"LTR-2103",message:"ไม่สามาทำรายการได้ เนื่องจากเครดิตไม่เพียงพอ"}
};

module.exports.owner = {
	duplicate_user: {code:"LTR-2201",message:"Username หรือ Email ของ Agnt มีอยู่แล้วในระบบ"},
	// msg1: {code:"LTR-2201",message:"example message1"},
	msg2: {code:"LTR-2202",message:"example message2"},
	msg3: {code:"LTR-2203",message:"example message3"}
};

module.exports.player = {
	duplicate_player: {code:"LTR-2301",message:"Player Name หรือ Username มีอยู่แล้วในระบบ"},
	msg2: {code:"LTR-2302",message:"example message2"},
	msg3: {code:"LTR-2303",message:"example message3"}
};

module.exports.employee = {
	msg1: {code:"LTR-3101",message:"example message1"},
	msg2: {code:"LTR-3102",message:"example message2"},
	msg3: {code:"LTR-3103",message:"example message3"}
};

module.exports.pomotion = {
	msg1: {code:"LTR-3201",message:"example message1"},
	msg2: {code:"LTR-3202",message:"example message2"},
	msg3: {code:"LTR-3203",message:"example message3"}
};