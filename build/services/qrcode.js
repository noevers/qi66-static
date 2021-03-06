"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const winston_1 = __importDefault(require("winston"));
const config_1 = __importDefault(require("../config"));
const got_1 = __importDefault(require("got"));
const nedb_1 = __importDefault(require("nedb"));

var jd_ua = 'jdapp;android;10.0.5;11;0393465333165363-5333430323261366;network/wifi;model/M2102K1C;osVer/30;appBuild/88681;partner/lc001;eufv/1;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 11; M2102K1C Build/RKQ1.201112.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045534 Mobile Safari/537.36';
let QRCodeService = class QRCodeService {
    constructor(logger) {
        this.logger = logger;
        this.cronDb = new nedb_1.default({ filename: config_1.default.cookieDbFile });
        this.s_token = undefined;
        this.cookies = undefined;
        this.guid = undefined;
        this.lsid = undefined;
        this.lstoken = undefined;
        this.okl_token = undefined;
        this.token = undefined;
        this.userCookie = "";
        this.cronDb.loadDatabase((err) => {
            if (err)
                throw err;
        });
    }
    praseSetCookies(response) {
        this.s_token = response.body.s_token;
        this.guid = response.headers['set-cookie'][0];
        this.guid = this.guid.substring(this.guid.indexOf("=") + 1, this.guid.indexOf(";"));
        this.lsid = response.headers['set-cookie'][2];
        this.lsid = this.lsid.substring(this.lsid.indexOf("=") + 1, this.lsid.indexOf(";"));
        this.lstoken = response.headers['set-cookie'][3];
        this.lstoken = this.lstoken.substring(this.lstoken.indexOf("=") + 1, this.lstoken.indexOf(";"));
        this.cookies = "guid=" + this.guid + "; lang=chs; lsid=" + this.lsid + "; lstoken=" + this.lstoken + "; ";
    }
    getCookie(response) {
        var TrackerID = response.headers['set-cookie'][0];
        TrackerID = TrackerID.substring(TrackerID.indexOf("=") + 1, TrackerID.indexOf(";"));
        var pt_key = response.headers['set-cookie'][1];
        pt_key = pt_key.substring(pt_key.indexOf("=") + 1, pt_key.indexOf(";"));
        var pt_pin = response.headers['set-cookie'][2];
        pt_pin = pt_pin.substring(pt_pin.indexOf("=") + 1, pt_pin.indexOf(";"));
        var pt_token = response.headers['set-cookie'][3];
        pt_token = pt_token.substring(pt_token.indexOf("=") + 1, pt_token.indexOf(";"));
        var pwdt_id = response.headers['set-cookie'][4];
        pwdt_id = pwdt_id.substring(pwdt_id.indexOf("=") + 1, pwdt_id.indexOf(";"));
        var s_key = response.headers['set-cookie'][5];
        s_key = s_key.substring(s_key.indexOf("=") + 1, s_key.indexOf(";"));
        var s_pin = response.headers['set-cookie'][6];
        s_pin = s_pin.substring(s_pin.indexOf("=") + 1, s_pin.indexOf(";"));
        this.cookies = "TrackerID=" + TrackerID + "; pt_key=" + pt_key + "; pt_pin=" + pt_pin + "; pt_token=" + pt_token + "; pwdt_id=" + pwdt_id + "; s_key=" + s_key + "; s_pin=" + s_pin + "; wq_skey=";
        var userCookie = "pt_key=" + pt_key + ";pt_pin=" + pt_pin + ";";
        console.log("\n############  ???????????????????????? Cookie  #############\n\n");
        console.log('Cookie1="' + userCookie + '"\n');
        console.log("\n####################################################\n\n");
        return userCookie;
    }
    async step1() {
        try {
            this.token = "";
            let timeStamp = (new Date()).getTime();
            let url = 'https://plogin.m.jd.com/cgi-bin/mm/new_login_entrance?lang=chs&appid=300&returnurl=https://wq.jd.com/passport/LoginRedirect?state=' + timeStamp + '&returnurl=https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action&source=wq_passport';
            const response = await got_1.default(url, {
                responseType: 'json',
                headers: {
                    'Connection': 'Keep-Alive',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'zh-cn',
                    'Referer': 'https://plogin.m.jd.com/login/login?appid=300&returnurl=https://wq.jd.com/passport/LoginRedirect?state=' + timeStamp + '&returnurl=https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action&source=wq_passport',
                    'User-Agent': jd_ua,
					'Host': 'plogin.m.jd.com'
                }
            });
            this.praseSetCookies(response);
        }
        catch (error) {
            this.cookies = "";
            console.log(error.response.body);
        }
    }
    async step2() {
        try {
            if (this.cookies == "") {
                return 0;
            }
            let timeStamp = (new Date()).getTime();
            let url = 'https://plogin.m.jd.com/cgi-bin/m/tmauthreflogurl?s_token=' + this.s_token + '&v=' + timeStamp + '&remember=true';
            const response = await got_1.default.post(url, {
                responseType: 'json',
                json: {
                    'lang': 'chs',
                    'appid': 300,
                    'returnurl': 'https://wqlogin2.jd.com/passport/LoginRedirect?state=' + timeStamp + '&returnurl=//home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action',
                    'source': 'wq_passport'
                },
                headers: {
                    'Connection': 'Keep-Alive',
                    'Content-Type': 'application/x-www-form-urlencoded; Charset=UTF-8',
                    'Accept': 'application/json, text/plain, */*',
                    'Cookie': this.cookies,
                    'Referer': 'https://plogin.m.jd.com/login/login?appid=300&returnurl=https://wqlogin2.jd.com/passport/LoginRedirect?state=' + timeStamp + '&returnurl=//home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action&source=wq_passport',
                    'User-Agent': jd_ua,
                    'Host': 'plogin.m.jd.com',
                }
            });
            this.token = response.body.token;
            this.okl_token = response.headers['set-cookie'][0];
            this.okl_token = this.okl_token.substring(this.okl_token.indexOf("=") + 1, this.okl_token.indexOf(";"));
            var qrUrl = 'https://plogin.m.jd.com/cgi-bin/m/tmauth?appid=300&client_type=m&token=' + this.token;
            return qrUrl;
        }
        catch (error) {
            console.log(error.response.body);
            return 0;
        }
    }
    async checkLogin() {
        try {
            if (this.cookies == "") {
                return 0;
            }
            let timeStamp = (new Date()).getTime();
            let url = 'https://plogin.m.jd.com/cgi-bin/m/tmauthchecktoken?&token=' + this.token + '&ou_state=0&okl_token=' + this.okl_token;
            const response = await got_1.default.post(url, {
                responseType: 'json',
                form: {
                    lang: 'chs',
                    appid: 300,
                    returnurl: 'https://wqlogin2.jd.com/passport/LoginRedirect?state=1100399130787&returnurl=//home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action',
                    source: 'wq_passport'
                },
                headers: {
                    'Referer': 'https://plogin.m.jd.com/login/login?appid=300&returnurl=https://wqlogin2.jd.com/passport/LoginRedirect?state=' + timeStamp + '&returnurl=//home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action&source=wq_passport',
                    'Cookie': this.cookies,
                    'Connection': 'Keep-Alive',
                    'Content-Type': 'application/x-www-form-urlencoded; Charset=UTF-8',
                    'Accept': 'application/json, text/plain, */*',
                    'User-Agent': jd_ua
                }
            });
            return response;
        }
        catch (error) {
            console.log(error.response.body);
            let res = {};
            res.body = { check_ip: 0, errcode: 222, message: '??????' };
            res.headers = {};
            return res;
        }
    }
    async qrcode() {
        await this.step1();
        const qrurl = await this.step2();
        return qrurl;
    }
    async status() {
        const cookie = await this.checkLogin();
        if (cookie.body.errcode == 0) {
            let ucookie = this.getCookie(cookie);
            return { err: 0, cookie: ucookie };
        }
        else {
            return { err: cookie.body.errcode, msg: cookie.body.message };
        }
    }
};
QRCodeService = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.Inject('logger')),
    __metadata("design:paramtypes", [Object])
], QRCodeService);
exports.default = QRCodeService;
//# sourceMappingURL=qrcode.js.map
