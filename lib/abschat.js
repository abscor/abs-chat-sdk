"use strict";

const SOCKET_CONNECTING = 0;
const SOCKET_OPEN = 1;
const SOCKET_CLOSING = 2;
const SOCKET_CLOSED = 3;

export default class ABSChat {

    constructor(token=null, session_id=null) {

		// default user provided methods
		this.onmessage = function (event) {
            console.log(`Build-in onmessage() received data ${event.data}`);
        };

    	// reset params
    	this.ws = null;
    	this.connection_status = null;

    	// configuration
        this.api_host = 'localhost:8600' // 'chat.abscorp.co'
        this.socket_protocol = 'ws' // 'wss'
        this.api_protocol = 'http' // 'https'

    	
        // user provided token
    	if (token) {
    		this.token = token;
	        this.setCookie('chat_token', this.token, 7);
    	}

    	if (session_id) {
    		this.session_id = session_id;
    	} else {
    		this.session_id = this.getCookie('chat_session_id') ? this.getCookie('chat_session_id') : Math.random();
    	}
    	this.setCookie('chat_session_id', this.session_id, 7);

    }

    connect() {
        this.ws = new WebSocket(`${this.socket_protocol}://${this.api_host}/listen`);
        this.ws.onmessage = this.onmessage;
    }

    sendMessage(from_name, to_session_id, body, base64_encoded_image) {
        var params = {
            body: body,
            message_id: Math.random(), // uuid
            timestamp: new Date(),
            from_name: from_name,
            session_id: 'admin',
            to_session_id: to_session_id,
            base64_encoded_image: base64_encoded_image
        }
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open('POST', `${this.api_protocol}://${this.api_host}/send`);
        xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(JSON.stringify(params));
    }

    credentialsToToken(username, password) {
        /*
        	Post credentials.
        	If successful, store the token
         */
        var self = this;
        var url = `${this.api_protocol}://${this.api_host}/login`;

        // Compile
        var data = {
            username: username,
            password: password,
            grant_type: "password"
        }
        var form_data = this.encodeAsForm(data);

        // Post
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open('POST', url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState > 3 && xhr.status == 200) {
                self.token = JSON.parse(xhr.response).access_token;
                self.setCookie('chat_token', self.token, 7);
            }
        };
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(form_data);
    }

    setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = `${name}=${(value || '')} ${expires}; path=/`;
    }

    getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    encodeAsForm(data){
    	/*
			Encode an object as form data
    	*/
        let urlEncodedData = "",
            urlEncodedDataPairs = [],
            name;
        // Turn the data object into an array of URL-encoded key/value pairs.
        for (name in data) {
            urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
        }
        // Combine the pairs into a single string and replace all %-encoded spaces to
        // the '+' character; matches the behaviour of browser form submissions.
        return urlEncodedDataPairs.join('&').replace(/%20/g, '+');
    }

    connectionCheck() {
        var state;
        if (this.ws.readyState == 1) {
            state = ('connection is ok')
        } else {
            state = ('Reconnecting on closed socket...')
            this.connect()
        }
        return state;
    }

    connectionMonitorLoop() {
        var self = this;
        if (this.connect_monitor_enabled) {
	        setTimeout(function () {
	            self.connection_status = self.connectionCheck();
	            self.connectionMonitorLoop();
	        }, 1000)
	    }
    }

    connectionMonitorLoopStart() {
    	this.connect_monitor_enabled = true;
    	this.connectionMonitorLoop()
    }

    connectionMonitorLoopStop() {
    	this.connect_monitor_enabled = false;
    }

}
