var CurrentTab = "";
var CPU_ydata = {};
var RAM_ydata = {};
var Logins_data = {};
var MachineId_IpHostname = {};
var Aggregate_prev_from_date = "";
var Aggregate_prev_to_date = "";
var util_response = {};

function InAggregate_openTab(event, subTabName){
    console.log(subTabName);
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks, tabdots;
    var TabDotToACtivate;

    var other_machine_live_ssh_check_div = document.getElementById('other-machine-live-ssh-check-div');
    if (other_machine_live_ssh_check_div != null){
	other_machine_live_ssh_check_div.remove();
    }

    var aggregate_fill_options_div = document.getElementById('aggregate-fill-options-div');
    if (aggregate_fill_options_div != null){
	aggregate_fill_options_div.remove();
    }

    var systems_rank_table = document.getElementById('systems-rank-table');
    if (systems_rank_table != null){
	systems_rank_table.remove();
    }
    
    var date_div_elems = document.getElementsByClassName("date-div");
    for (i=0; i<date_div_elems.length; i++) {
	date_div_elems[i].style.display = "block";
    }
    var system_names_elems = document.getElementsByClassName("system-names-titles-div");
    for (i=0; i<system_names_elems.length; i++) {
    	system_names_elems[i].style.display = "block";
    }
    var system_names_elems_c = document.getElementsByClassName("system-names-container-div");
    for (i=0; i<system_names_elems_c.length; i++) {
    	system_names_elems_c[i].style.display = "block";
    }

     var date_div_elems = document.getElementsByClassName("date-div");
    for (i=0; i<date_div_elems.length; i++) {
	date_div_elems[i].style.visibility = "visible";
    }

    var system_names_elems = document.getElementsByClassName("system-names-titles-div");
    for (i=0; i<system_names_elems.length; i++) {
    	system_names_elems[i].style.visibility = 'visible';
    }
    var system_names_elems_c = document.getElementsByClassName("system-names-container-div");
    for (i=0; i<system_names_elems_c.length; i++) {
    	system_names_elems_c[i].style.visibility = 'visible';
    }
    
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i=0; i<tabcontent.length; i++) {
	tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i=0; i<tablinks.length; i++) {
	tablinks[i].className = tablinks[i].className.replace("active", "");
    }

    // Get all elements with class="dot-tab" and remove the class "activate"
    tabdots = document.getElementsByClassName("dot-tab");
    for (i=0; i<tabdots.length; i++) {
    	tabdots[i].className = tabdots[i].className.replace("activate", "");
    }

    // Show the current tab, and add an active class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    //evt.currentTartget.className += " active";
    
    // Activate the appropriate tab's dot
    TabDotToActivate = document.getElementById(tabName+"-dot");
    console.log(TabDotToActivate);
    TabDotToActivate.className += "activate";

    
    if(tabName == "CPU")
    {
	_FillCPUChart();
	CurrentTab = "CPU";
    }
    else if(tabName == "RAM")
    {
	_FillRAMChart();
	CurrentTab = "RAM";
    }
    else if(tabName == "Logins")
    {
	_FillLoginsChart();
	CurrentTab = "Logins";
    }
    else if(tabName == "Aggregate")
    {
	_AggregateTabSelected();
	CurrentTab = "Aggregate";
    }
    else if(tabName == "SSH")
    {
	_SSHTabSelected();
	CurrentTab = "SSH";
    }
}

function check_ssh_now(btn_id_clicked){
    console.log(btn_id_clicked.id+" clicked");
    //request status of the IP (btn_id_clicked.id.replace("_check_now_btn", ""))
    xhr_object = new XMLHttpRequest();
    xhr_object.onload = check_ssh_now_waiting_response;
    xhr_object.btn_id_clicked=btn_id_clicked;
    xhr_object.open('GET', 'http://'+document.BACKEND_URL+'/api/v1/live-ssh-test/'+btn_id_clicked.machine_id);
    xhr_object.send();
}

function check_ssh_now_response_recieved(requested_status, btn_id_clicked){
    console.log(btn_id_clicked);
    //requested_status = false;
    if(requested_status){
	document.getElementById(btn_id_clicked.id.replace("_btn", "_status")).innerHTML = "<span style='font-size: 13px; color: #28b463; text-align: center; display:block;'>" + "SSH Succeeded Now";
    }
    else{
	document.getElementById(btn_id_clicked.id.replace("_btn", "_status")).innerHTML = "<span style='font-size: 13px; color: #e74c3c; text-align: center; display:block;'>" + "SSH Failed Now";
    }
}

function check_ssh_now_waiting_response(){
    if(this.readyState == 4 && this.status == 200)
    {
	var res = this.responseText;
	var resJSON = JSON.parse(res);
	var requested_status = resJSON[Object.keys(resJSON)[0]];
	console.log(requested_status);
	if(CurrentTab == "SSH")
	{
	    check_ssh_now_response_recieved(requested_status, this.btn_id_clicked);
	}
    }
}

function _FillSSHData()
{
    if(this.readyState == 4 && this.status == 200)
    {
	var res = this.responseText;
	var resJSON = JSON.parse(res);
	var failed_ssh = resJSON[Object.keys(resJSON)[0]]["failed"];
	var passed_ssh = resJSON[Object.keys(resJSON)[0]]["passed"];
	if(CurrentTab == "SSH")
	{
	    _FillSSHData_internal(failed_ssh, passed_ssh);
	}
    }    
}

function _FillSSHData_internal(failed_ssh, success_ssh)
{
    //var failed_ssh = {"10.10.1.31":{"hostname":"bobsled", "user":"igroup"}, "10.10.1.32":{"hostname":"bobsled1", "user":"igroup1"}};
    //var success_ssh = {"10.10.1.33":{"hostname":"bobsled", "user":"igroup"}, "10.10.1.34":{"hostname":"bobsled1", "user":"igroup1"}};
    var arrHead = new Array();
    arrHead = ['Sl.No.', 'IP Address', 'Hostname', 'SSH tried for User', '', 'Check now status'];

    if(Object.keys(failed_ssh).length!=0)
    {
	var failed_ssh_table = document.createElement('table');
	failed_ssh_table.setAttribute('id', 'failed_ssh_table');
	failed_ssh_table.setAttribute('class', 'failed_ssh_table');
	document.getElementById("SSH").appendChild(failed_ssh_table);
	//console.log(document.getElementById('failed_ssh_table'));
	var failed_ssh_caption = document.getElementById('failed_ssh_table').createCaption();
	failed_ssh_caption.innerHTML = "<span style='font-size: 18px; color: #064769; font-family: Monospace; font-variant: small-caps; font-weight: 700;'>" + "SSH failed for:<br>";
	var failed_ssh_tr = failed_ssh_table.insertRow(-1);

	//table header
	for(var h=0; h<arrHead.length; h++){
	    var failed_ssh_th = document.createElement('th');
	    failed_ssh_th.innerHTML = "<span style='font-size: 15px; color: #7b241c; font-family: Monospace;'>" + "  "+arrHead[h]+"  ";
	    failed_ssh_tr.appendChild(failed_ssh_th);
	}
	
	var failed_IPs = Object.keys(failed_ssh);

	for(var c=0; c<failed_IPs.length; c++) {
	    failed_ssh_tr = failed_ssh_table.insertRow(-1);
	    failed_ssh_tr.id="failed_ssh_tr_"+failed_IPs[c];
	    
	    var td_1 = document.createElement('td');
	    td_1 = failed_ssh_tr.insertCell(-1);
	    td_1.innerHTML = "<span style='font-size: 13px; color: #e74c3c; font-family: Monospace;text-align: center; display:block;'>" + (c+1).toString();
	    failed_ssh_tr.appendChild(td_1);
	    
	    var td_2 = document.createElement('td');
	    td_2 = failed_ssh_tr.insertCell(-1);
	    td_2.innerHTML = "<span style='font-size: 13px; color: #e74c3c; font-family: Monospace;text-align: center; display:block;'>" + failed_IPs[c];
	    failed_ssh_tr.appendChild(td_2);
	    
	    var td_3 = document.createElement('td');
	    td_3 = failed_ssh_tr.insertCell(-1);
	    td_3.innerHTML = "<span style='font-size: 13px; color: #e74c3c; font-family: Monospace;text-align: center; display:block;'>" + failed_ssh[failed_IPs[c]]["hostname"];
	    failed_ssh_tr.appendChild(td_3);
	    
	    var td_4 = document.createElement('td');
	    td_4 = failed_ssh_tr.insertCell(-1);
	    td_4.innerHTML = "<span style='font-size: 13px; color: #e74c3c; font-family: Monospace;text-align: center; display:block;'>" + failed_ssh[failed_IPs[c]]["user"];
	    failed_ssh_tr.appendChild(td_4);
	    
	    var td_5 = document.createElement('td');
	    td_5 = failed_ssh_tr.insertCell(-1);
	    var btn = document.createElement('input');
	    btn.type = "button";
	    btn.id = failed_IPs[c]+"_check_now_btn";
	    btn.machine_id = failed_ssh[failed_IPs[c]]["mac"];
	    btn.value = "check now";
	    btn.onclick = function() {check_ssh_now(this)};
	    td_5.appendChild(btn);
	    failed_ssh_tr.appendChild(td_5);

	    var td_6 = document.createElement('td');
	    td_6 = failed_ssh_tr.insertCell(-1);
	    td_6.innerHTML = "";
	    td_6.id = failed_IPs[c]+"_check_now_status"
	    failed_ssh_tr.appendChild(td_6);
	}
	document.getElementById("SSH").appendChild(failed_ssh_table);
	document.getElementById('failed_ssh_table').border=1;
    }
    
    if(Object.keys(success_ssh).length!=0)
    {
	var success_ssh_table = document.createElement('table');
	success_ssh_table.setAttribute('id', 'success_ssh_table');
	document.getElementById("SSH").appendChild(success_ssh_table);
	var success_ssh_caption = document.getElementById('success_ssh_table').createCaption();
	success_ssh_caption.innerHTML = "<span style='font-size: 18px; color: #064769; font-family: Monospace; font-variant: small-caps; font-weight: 700;'>" + "<br>SSH succeeded for:<br>";
	var success_ssh_tr = success_ssh_table.insertRow(-1);

	//table header
	for(var h=0; h<arrHead.length;h++){
	    var success_ssh_th = document.createElement('th');
	    success_ssh_th.innerHTML = "<span style='font-size: 15px; color: #145a32; font-family: Monospace;'>" + "  "+arrHead[h]+"  ";
	    success_ssh_tr.appendChild(success_ssh_th);
	}

	var success_IPs = Object.keys(success_ssh);

	for(var c=0; c<success_IPs.length; c++) {
	    success_ssh_tr = success_ssh_table.insertRow(-1);
	    
	    var td_1 = document.createElement('td');
	    td_1 = success_ssh_tr.insertCell(-1);
	    td_1.innerHTML = "<span style='font-size: 13px; color: #006400; font-family: Monospace;text-align: center; display:block;'>" + (c+1).toString();
	    success_ssh_tr.appendChild(td_1);
	    
	    var td_2 = document.createElement('td');
	    td_2 = success_ssh_tr.insertCell(-1);
	    td_2.innerHTML = "<span style='font-size: 13px; color:#006400; font-family: Monospace;text-align: center; display:block;'>" + success_IPs[c];
	    success_ssh_tr.appendChild(td_2);
	    
	    var td_3 = document.createElement('td');
	    td_3 = success_ssh_tr.insertCell(-1);
	    td_3.innerHTML = "<span style='font-size: 13px; color: #006400; font-family: Monospace;text-align: center; display:block;'>" + success_ssh[success_IPs[c]]["hostname"];
	    success_ssh_tr.appendChild(td_3);
	    
	    var td_4 = document.createElement('td');
	    td_4 = success_ssh_tr.insertCell(-1);
	    td_4.innerHTML = "<span style='font-size: 13px; color: #006400; font-family: Monospace;text-align: center; display:block;'>" + success_ssh[success_IPs[c]]["user"];
	    success_ssh_tr.appendChild(td_4);
	    
	    var td_5 = document.createElement('td');
	    td_5 = success_ssh_tr.insertCell(-1);
	    var btn = document.createElement('input');
	    btn.type = "button";
	    btn.id = success_IPs[c]+"_check_now_btn";
	    btn.machine_id = success_ssh[success_IPs[c]]["mac"];
	    btn.value = "check now";
	    btn.onclick = function() {check_ssh_now(this)};
	    td_5.appendChild(btn);
	    success_ssh_tr.appendChild(td_5);
	    
	    var td_6 = document.createElement('td');
	    td_6 = success_ssh_tr.insertCell(-1);
	    td_6.innerHTML = "";
	    td_6.id = success_IPs[c]+"_check_now_status"
	    success_ssh_tr.appendChild(td_6);
	}
	document.getElementById("SSH").appendChild(success_ssh_table);
	document.getElementById('success_ssh_table').border=1;
    }   

}

function _SSHTabSelected()
{
    console.log("SSHTabSelected");
    var i;
    // var date_div_elems = document.getElementsByClassName("date-div");
    // for (i=0; i<date_div_elems.length; i++) {
    // 	date_div_elems[i].style.display = "none";
    // }
    var system_names_elems = document.getElementsByClassName("system-names-titles-div");
    for (i=0; i<system_names_elems.length; i++) {
    	system_names_elems[i].style.visibility = 'hidden';
    }
    var system_names_elems_c = document.getElementsByClassName("system-names-container-div");
    for (i=0; i<system_names_elems_c.length; i++) {
    	system_names_elems_c[i].style.visibility = 'hidden';
    }
    // document.getElementById("SSH").style.display = "none";

    var other_machine_live_ssh_check_div = document.createElement('div');
    other_machine_live_ssh_check_div.id = 'other-machine-live-ssh-check-div';
    document.getElementsByClassName('main-space-div')[0].appendChild(other_machine_live_ssh_check_div);
    other_machine_live_ssh_check_div.style.backgroundColor = 'hsla(210, 20%, 50%, 0.3)';
    other_machine_live_ssh_check_div.style.position = 'relative';
    other_machine_live_ssh_check_div.style.top = '28%';
    other_machine_live_ssh_check_div.style.left = '3%';
    other_machine_live_ssh_check_div.style.height = '57%'
    other_machine_live_ssh_check_div.style.width = '25%';

    var other_machine_live_ssh_check_title = document.createElement('div');
    other_machine_live_ssh_check_title.id = 'other-machine-live-ssh-check-title';
    document.getElementById('other-machine-live-ssh-check-div').appendChild(other_machine_live_ssh_check_title);
    other_machine_live_ssh_check_title.style.backgroundColor = 'transparent';
    other_machine_live_ssh_check_title.style.position = 'relative';
    other_machine_live_ssh_check_title.style.top = '5%';
    other_machine_live_ssh_check_title.style.left = '-30%';
    other_machine_live_ssh_check_title.style.height = '10%';
    other_machine_live_ssh_check_title.style.width = '100%';
    other_machine_live_ssh_check_title.innerHTML = " Live SSH Check";
    other_machine_live_ssh_check_title.style.color = '#064771';
    other_machine_live_ssh_check_title.style.fontFamily = "Avantgarde, 'TeX Gyre Adventor', 'URW Gothic L', sans-serif";
    other_machine_live_ssh_check_title.style.fontSize =  '14px';
    other_machine_live_ssh_check_title.style.fontWeight = '700';
    other_machine_live_ssh_check_title.style.fontVariant = 'small-caps';
    other_machine_live_ssh_check_title.style.textAlign = 'center';


    var ssh_IP_title = document.createElement('div');
    ssh_IP_title.id = 'ssh-IP-title';
    document.getElementById('other-machine-live-ssh-check-div').appendChild(ssh_IP_title);
    ssh_IP_title.style.backgroundColor = 'transparent';
    ssh_IP_title.style.position = 'relative';
    ssh_IP_title.style.top = '13%';
    ssh_IP_title.style.left = '-65%';
    ssh_IP_title.style.height = '9%';
    ssh_IP_title.innerHTML = " IP Address:";
    ssh_IP_title.style.color = '#064771';
    ssh_IP_title.style.fontFamily = "Avantgarde, 'TeX Gyre Adventor', 'URW Gothic L', sans-serif";
    ssh_IP_title.style.fontSize =  '15px';
    ssh_IP_title.style.fontWeight = '400';
    ssh_IP_title.style.textAlign = 'right';

    var ssh_username_title = document.createElement('div');
    ssh_username_title.id = 'ssh-username-title';
    document.getElementById('other-machine-live-ssh-check-div').appendChild(ssh_username_title);
    ssh_username_title.style.backgroundColor = 'transparent';
    ssh_username_title.style.position = 'relative';
    ssh_username_title.style.top = '23%';
    ssh_username_title.style.left = '-65%';
    ssh_username_title.style.height = '9%';
    ssh_username_title.innerHTML = " Username:";
    ssh_username_title.style.color = '#064771';
    ssh_username_title.style.fontFamily = "Avantgarde, 'TeX Gyre Adventor', 'URW Gothic L', sans-serif";
    ssh_username_title.style.fontSize =  '15px';
    ssh_username_title.style.fontWeight = '400';
    ssh_username_title.style.textAlign = 'right';

    var ssh_password_title = document.createElement('div');
    ssh_password_title.id = 'ssh-password-title';
    document.getElementById('other-machine-live-ssh-check-div').appendChild(ssh_password_title);
    ssh_password_title.style.backgroundColor = 'transparent';
    ssh_password_title.style.position = 'relative';
    ssh_password_title.style.top = '33%';
    ssh_password_title.style.left = '-65%';
    ssh_password_title.style.height = '9%';
    ssh_password_title.innerHTML = " Password:";
    ssh_password_title.style.color = '#064771';
    ssh_password_title.style.fontFamily = "Avantgarde, 'TeX Gyre Adventor', 'URW Gothic L', sans-serif";
    ssh_password_title.style.fontSize =  '15px';
    ssh_password_title.style.fontWeight = '400';
    ssh_password_title.style.textAlign = 'right';

    var ssh_IP_input = document.createElement('INPUT');
    ssh_IP_input.id = 'ssh-IP-input';
    document.getElementById('other-machine-live-ssh-check-div').appendChild(ssh_IP_input);
    ssh_IP_input.style.position = 'relative';
    ssh_IP_input.style.top = '-65%';
    ssh_IP_input.style.left = '37%';
    ssh_IP_input.style.height = '4%';
    ssh_IP_input.style.width = '55%';

    var ssh_username_input = document.createElement('INPUT');
    ssh_username_input.id = 'ssh-username-input';
    document.getElementById('other-machine-live-ssh-check-div').appendChild(ssh_username_input);
    ssh_username_input.style.position = 'relative';
    ssh_username_input.style.top = '-60%';
    ssh_username_input.style.left = '37%';
    ssh_username_input.style.height = '4%';
    ssh_username_input.style.width = '55%';

    var ssh_password_input = document.createElement('INPUT');
    ssh_password_input.id = 'ssh-password-input';
    ssh_password_input.setAttribute("type", "password");
    ssh_password_input.setAttribute("value", "pswtext");
    document.getElementById('other-machine-live-ssh-check-div').appendChild(ssh_password_input);
    ssh_password_input.style.position = 'relative';
    ssh_password_input.style.top = '-55%';
    ssh_password_input.style.left = '37%';
    ssh_password_input.style.height = '4%';
    ssh_password_input.style.width = '55%';

    var ssh_response = document.createElement('div');
    ssh_response.id = 'ssh-response';
    document.getElementById('other-machine-live-ssh-check-div').appendChild(ssh_response);
    ssh_response.style.backgroundColor = 'transparent';
    ssh_response.style.position = 'relative';
    ssh_response.style.top = '-50%';
    ssh_response.style.left = '0%';
    ssh_response.style.height = '13%';
    ssh_response.innerHTML = "";
    ssh_response.style.color = '#064771';
    ssh_response.style.fontFamily = "Avantgarde, 'TeX Gyre Adventor', 'URW Gothic L', sans-serif";
    ssh_response.style.fontSize =  '17px';
    ssh_response.style.fontWeight = '900';
    ssh_response.style.textAlign = 'center';

    var other_machine_live_ssh_check_btn = document.createElement("BUTTON");
    var other_machine_live_ssh_check_btn_text = document.createTextNode("Check Now!");
    other_machine_live_ssh_check_btn.appendChild(other_machine_live_ssh_check_btn_text);
    document.getElementById('other-machine-live-ssh-check-div').appendChild(other_machine_live_ssh_check_btn);
    other_machine_live_ssh_check_btn.style.backgroundColor = 'whitesmoke';
    other_machine_live_ssh_check_btn.style.position = 'relative';
    other_machine_live_ssh_check_btn.style.top = '-50%';
    other_machine_live_ssh_check_btn.style.left = '32%';
    other_machine_live_ssh_check_btn.style.height = '9%';
    other_machine_live_ssh_check_btn.style.color = '#064771';
    other_machine_live_ssh_check_btn.style.fontFamily = "Avantgarde, 'TeX Gyre Adventor', 'URW Gothic L', sans-serif";
    other_machine_live_ssh_check_btn.style.fontSize =  '15px';
    other_machine_live_ssh_check_btn.style.fontWeight = '700';
    other_machine_live_ssh_check_btn.style.textAlign = 'center';
    other_machine_live_ssh_check_btn.onclick = _OtherMachineLiveSSHCheckBtnClicked;

    document.getElementById("SSH").innerHTML = "";
    //_FillSSHData();
    
    //SSH-test
    xhr_object_ssh = new XMLHttpRequest();
    xhr_object_ssh.onload = _FillSSHData;
    xhr_object_ssh.open('GET', 'http://'+document.BACKEND_URL+'/api/v1/ssh-test/'+document.getElementById('date-input').value);
    xhr_object_ssh.send();
}

function _OtherMachineLiveSSHCheckBtnClicked()
{
    var IP = document.getElementById('ssh-IP-input').value;
    var username = document.getElementById('ssh-username-input').value;
    var password = document.getElementById('ssh-password-input').value;

    var ssh_response = document.getElementById('ssh-response');
    ssh_response.innerHTML = "";

    if(IP.trim() == ""){
	ssh_response.innerHTML = "<span style='color: #ff0000;'>" + "Enter IP!";
    }
    else if(username.trim() == ""){
	ssh_response.innerHTML = "<span style='color: #ff0000;'>" + "Enter Username!";
    }
    else if(password.trim() == ""){
	ssh_response.innerHTML = "<span style='color: #ff0000;'>" + "Enter Password!";
    }
    else {
	//SSH-test
	xhr_object_ssh = new XMLHttpRequest();
	xhr_object_ssh.onload = _OtherMachineLiveSSHCheckWaitingResponse;
	xhr_object_ssh.open('GET', 'http://'+document.BACKEND_URL+'/api/v1/live-ssh-test-other-machines/'+IP+'/'+username+'/'+password);
	xhr_object_ssh.send();
    }
}

function _OtherMachineLiveSSHCheckWaitingResponse(){
    if(this.readyState == 4 && this.status == 200)
    {
	var res = this.responseText;
	var resJSON = JSON.parse(res);
	var requested_status = resJSON[Object.keys(resJSON)[0]];
	console.log(requested_status);
	if(CurrentTab == "SSH")
	{
	    _OtherMachineLiveSSHCheckRecievedResponse(requested_status);
	}
    }    
}

function _OtherMachineLiveSSHCheckRecievedResponse(requested_status){
    var ssh_response = document.getElementById('ssh-response');
    if(requested_status == true){
	ssh_response.innerHTML = "<span style='color: #145a32;'>" + "SSH Successful!";
    }
    else{
	ssh_response.innerHTML = "<span style='color: #ff0000;'>" + "SSH Failed..";
    }
}


function _AggregateTabSelected()
{
    console.log("AggregateTabSelected");
    var i;
    var date_div_elems = document.getElementsByClassName("date-div");
    for (i=0; i<date_div_elems.length; i++) {
	date_div_elems[i].style.visibility = "hidden";
    }
    var system_names_elems = document.getElementsByClassName("system-names-titles-div");
    for (i=0; i<system_names_elems.length; i++) {
	system_names_elems[i].style.visibility = "hidden";
    }
    var system_names_elems_c = document.getElementsByClassName("system-names-container-div");
    for (i=0; i<system_names_elems_c.length; i++) {
	system_names_elems_c[i].style.visibility = "hidden";
    }
    document.getElementById("Aggregate").style.visibility = "visible";

    var aggregate_fill_options_div = document.createElement('div');
    aggregate_fill_options_div.id = 'aggregate-fill-options-div';
    document.getElementsByClassName('main-space-div')[0].appendChild(aggregate_fill_options_div);
    aggregate_fill_options_div.style.backgroundColor = 'transparent';//'hsla(210, 20%, 50%, 0.2)';
    aggregate_fill_options_div.style.position = 'relative';
    aggregate_fill_options_div.style.top = '5%';
    aggregate_fill_options_div.style.left = '3%';
    aggregate_fill_options_div.style.height = '77%'
    aggregate_fill_options_div.style.width = '30%';

    var aggregate_from_date_title = document.createElement('div');
    aggregate_from_date_title.id = 'aggregate-from-date-title';
    document.getElementById('aggregate-fill-options-div').appendChild(aggregate_from_date_title);
    aggregate_from_date_title.style.backgroundColor = 'transparent';
    aggregate_from_date_title.style.position = 'relative';
    aggregate_from_date_title.style.top = '3%';
    aggregate_from_date_title.style.left = '-65%';
    aggregate_from_date_title.style.height = '13%';
    aggregate_from_date_title.innerHTML = " From Date:";
    aggregate_from_date_title.style.color = '#064771';
    aggregate_from_date_title.style.fontFamily = "Avantgarde, 'TeX Gyre Adventor', 'URW Gothic L', sans-serif";
    aggregate_from_date_title.style.fontSize =  '16px';
    aggregate_from_date_title.style.fontWeight = '600';
    aggregate_from_date_title.style.textAlign = 'right';
    aggregate_from_date_title.style.fontVariant = 'small-caps';

    var aggregate_from_date_input = document.createElement("INPUT");
    aggregate_from_date_input.setAttribute("type", "date");
    aggregate_from_date_input.id = 'aggregate-from-date-input';
    //aggregate_from_date_input.setAttribute("value", "2014-02-09");
    document.getElementById('aggregate-fill-options-div').appendChild(aggregate_from_date_input);
    aggregate_from_date_input.style.position = 'relative';
    aggregate_from_date_input.style.top = '-13%';
    aggregate_from_date_input.style.left = '-13%';
    aggregate_from_date_input.style.height = '9%';

    var yesterday_date = new Date(new Date().setDate(new Date().getDate()-1));
    var week_back_date = new Date(new Date().setDate(new Date().getDate()-7));
    var min_date = new Date(new Date().setDate(new Date().getDate()-30));
    var max_date = yesterday_date;
    
    aggregate_from_date_input.value = week_back_date.toISOString().substr(0, 10);
    aggregate_from_date_input.min = min_date.toISOString().substr(0, 10);
    aggregate_from_date_input.max = max_date.toISOString().substr(0, 10);

    var aggregate_to_date_title = document.createElement('div');
    aggregate_to_date_title.id = 'aggregate-to-date-title';
    document.getElementById('aggregate-fill-options-div').appendChild(aggregate_to_date_title);
    aggregate_to_date_title.style.backgroundColor = 'transparent';
    aggregate_to_date_title.style.position = 'relative';
    aggregate_to_date_title.style.top = '-7%';
    aggregate_to_date_title.style.left = '-65%';
    aggregate_to_date_title.style.height = '13%';
    aggregate_to_date_title.innerHTML = " To Date:";
    aggregate_to_date_title.style.color = '#064771';
    aggregate_to_date_title.style.fontFamily = "Avantgarde, 'TeX Gyre Adventor', 'URW Gothic L', sans-serif";
    aggregate_to_date_title.style.fontSize =  '16px';
    aggregate_to_date_title.style.fontWeight = '600';
    aggregate_to_date_title.style.textAlign = 'right';
    aggregate_to_date_title.style.fontVariant = 'small-caps';

    var aggregate_to_date_input = document.createElement("INPUT");
    aggregate_to_date_input.id = 'aggregate-to-date-input';
    aggregate_to_date_input.setAttribute("type", "date");
    document.getElementById('aggregate-fill-options-div').appendChild(aggregate_to_date_input);
    aggregate_to_date_input.style.position = 'relative';
    aggregate_to_date_input.style.top = '-23%';
    aggregate_to_date_input.style.left = '-13%';
    aggregate_to_date_input.style.height = '9%';
    aggregate_to_date_input.style.width = '37%';

    aggregate_to_date_input.value = yesterday_date.toISOString().substr(0, 10);
    aggregate_to_date_input.min = min_date.toISOString().substr(0, 10);
    aggregate_to_date_input.max = max_date.toISOString().substr(0, 10);

    var aggregate_parameter_title = document.createElement('div');
    aggregate_parameter_title.id = 'aggregate-parameter-title';
    document.getElementById('aggregate-fill-options-div').appendChild(aggregate_parameter_title);
    aggregate_parameter_title.style.backgroundColor = 'transparent';
    aggregate_parameter_title.style.position = 'relative';
    aggregate_parameter_title.style.top = '-18%';
    aggregate_parameter_title.style.left = '-65%';
    aggregate_parameter_title.style.height = '13%';
    aggregate_parameter_title.innerHTML = "Parameter:";
    aggregate_parameter_title.style.color = '#064771';
    aggregate_parameter_title.style.fontFamily = "Avantgarde, 'TeX Gyre Adventor', 'URW Gothic L', sans-serif";
    aggregate_parameter_title.style.fontSize =  '16.5px';
    aggregate_parameter_title.style.fontWeight = '600';
    aggregate_parameter_title.style.textAlign = 'right';
    aggregate_parameter_title.style.fontVariant = 'small-caps';

    var aggregate_parameter_select = document.createElement('select');
    aggregate_parameter_select.id = 'aggregate-parameter-select';
    document.getElementById('aggregate-fill-options-div').appendChild(aggregate_parameter_select);
    aggregate_parameter_select.style.position = 'relative';
    aggregate_parameter_select.style.top = '-35%';
    aggregate_parameter_select.style.left = '37%';
    aggregate_parameter_select.style.height = '10%';
    aggregate_parameter_select.style.width = '55%';
    var aggregate_parameter_CPU_option = new Option('CPU Utilization %', 'CPU', false, false);
    aggregate_parameter_select.appendChild(aggregate_parameter_CPU_option);
    var aggregate_parameter_RAM_option = new Option('RAM Utilization %', 'RAM', false, false);
    aggregate_parameter_select.appendChild(aggregate_parameter_RAM_option);
    var aggregate_parameter_CPUAndRAM_option = new Option('CPU & RAM Utilization %', 'CPU-RAM', false, false);
    aggregate_parameter_select.appendChild(aggregate_parameter_CPUAndRAM_option);

    var aggregate_generate_system_ranking_btn = document.createElement("BUTTON");
    var aggregate_generate_system_ranking_btn_text = document.createTextNode("Generate Systems Ranking");
    aggregate_generate_system_ranking_btn.appendChild(aggregate_generate_system_ranking_btn_text);
    document.getElementById('aggregate-fill-options-div').appendChild(aggregate_generate_system_ranking_btn);
    aggregate_generate_system_ranking_btn.style.backgroundColor = 'hsla(210, 20%, 50%, 0.3)';
    aggregate_generate_system_ranking_btn.style.position = 'relative';
    aggregate_generate_system_ranking_btn.style.top = '-30%';
    aggregate_generate_system_ranking_btn.style.left = '20%';
    aggregate_generate_system_ranking_btn.style.height = '9.5%';
    aggregate_generate_system_ranking_btn.style.color = '#064771';
    aggregate_generate_system_ranking_btn.style.fontFamily = "Avantgarde, 'TeX Gyre Adventor', 'URW Gothic L', sans-serif";
    aggregate_generate_system_ranking_btn.style.fontSize =  '15px';
    aggregate_generate_system_ranking_btn.style.fontWeight = '700';
    aggregate_generate_system_ranking_btn.style.textAlign = 'center';
    aggregate_generate_system_ranking_btn.onclick = _AggregateGenerateSystemRankingBtnClicked;
}

function _AggregateGenerateSystemRankingBtnClicked()
{
    console.log('_AggregateGenerateSystemRankingBtnClicked');
    var systems_rank_table = document.getElementById('systems-rank-table');
    if (systems_rank_table != null){
	systems_rank_table.remove();
    }
    var from_date = document.getElementById('aggregate-from-date-input').value;
    var to_date = document.getElementById('aggregate-to-date-input').value;
    var parameter = document.getElementById('aggregate-parameter-select').value;
    console.log(from_date, to_date, parameter);
    //make request to backend only if the aggregation period is changed, or else re-use the data
    if((Aggregate_prev_from_date != from_date) || (Aggregate_prev_to_date != to_date)){
	 _AggregateGenerateSystemRankingWaitingResponse();
    }
    else {
	_AggregateGenerateSystemRankingRecievedResponse(false,util_response);
    }
    
}

function _AggregateGenerateSystemRankingWaitingResponse()
{
    util_response = {'hostname@10.10.3.183':{'CPU': 80.12, 'RAM': 20.1},'hostname1@10.10.3.133':{'CPU': 87.12, 'RAM': 93.45},'casandra@10.10.3.38':{'CPU': 8.12, 'RAM': 99.1}};
    _AggregateGenerateSystemRankingRecievedResponse(true, util_response);
}

function _AggregateGenerateSystemRankingRecievedResponse(from_new_request, util_response){
    var parameter = document.getElementById('aggregate-parameter-select').value;
    var hostnameATaddress = Object.keys(util_response);
    if(from_new_request == true){
	for(var i=0; i<hostnameATaddress.length; i++){
	    util_response[hostnameATaddress[i]]['CPU-RAM'] = (util_response[hostnameATaddress[i]]['CPU']+util_response[hostnameATaddress[i]]['RAM'])/2;
	}
    }
    var items = Object.keys(util_response).map(function(key) {
	return [key, util_response[key]['CPU'], util_response[key]['RAM'], util_response[key]['CPU-RAM']];
    });
    if( parameter == 'CPU'){
	items.sort(function(first, second) {
	    return second[1] - first[1];
	});
    }
    else if( parameter == 'RAM'){
	items.sort(function(first, second) {
	    return second[2] - first[2];
	});
    }
    else if( parameter == 'CPU-RAM'){
	items.sort(function(first, second) {
	    return second[3] - first[3];
	});
    }

    var arrHead = new Array();
    arrHead = ['Ranking', 'IP Address', 'Hostname', 'CPU Utilization', 'RAM Utilization'];

    var systems_rank_table = document.createElement('table');
    systems_rank_table.setAttribute('id', 'systems-rank-table');
    document.getElementById('Aggregate').appendChild(systems_rank_table);
    systems_rank_table_caption = document.getElementById('systems-rank-table').createCaption();
    systems_rank_table_caption.innerHTML = "<span style='font-size: 18px; color: #064769; font-family: Monospace; font-variant: small-caps; font-weight: 700;'>" + "Aggregate System Utilization Ranking:<br><br>";
    var systems_rank_tr = systems_rank_table.insertRow(-1);

    //table header
    for(var h=0; h<arrHead.length; h++){
	var systems_rank_th = document.createElement('th');
	systems_rank_th.innerHTML = "<span style='font-size: 15px; color: #064769; font-family: Monospace;'>" + "  "+arrHead[h]+"  ";
	systems_rank_tr.appendChild(systems_rank_th);
    }

    for(var c=0; c<items.length; c++){
	systems_rank_tr = systems_rank_table.insertRow(-1);

	var td_1 = document.createElement('td');
	td_1 = systems_rank_tr.insertCell(-1);
	td_1.innerHTML = "<span style='font-size: 13px; color: #145a32; font-family: Monospace;text-align: center; display:block;'>" + (c+1).toString();
	systems_rank_tr.appendChild(td_1);

	var item_hostnameATaddress = items[c][0].split("@");

	var td_2 = document.createElement('td');
	td_2 = systems_rank_tr.insertCell(-1);
	td_2.innerHTML = "<span style='font-size: 13px; color: #145a32; font-family: Monospace;text-align: center; display:block;'>" + item_hostnameATaddress[1];
	systems_rank_tr.appendChild(td_2);

	var td_3 = document.createElement('td');
	td_3 = systems_rank_tr.insertCell(-1);
	td_3.innerHTML = "<span style='font-size: 13px; color: #145a32; font-family: Monospace;text-align: center; display:block;'>" + item_hostnameATaddress[0];
	systems_rank_tr.appendChild(td_3);

	var td_4 = document.createElement('td');
	td_4 = systems_rank_tr.insertCell(-1);
	td_4.innerHTML = "<span style='font-size: 13px; color: #145a32; font-family: Monospace;text-align: center; display:block;'>" + items[c][1].toString() + "%";
	systems_rank_tr.appendChild(td_4);

	var td_5 = document.createElement('td');
	td_5 = systems_rank_tr.insertCell(-1);
	td_5.innerHTML = "<span style='font-size: 13px; color: #145a32; font-family: Monospace;text-align: center; display:block;'>" + items[c][2].toString() + "%";
	systems_rank_tr.appendChild(td_5);
    }
    document.getElementById("Aggregate").appendChild(systems_rank_table);
    document.getElementById('systems-rank-table').border=1;
}

function _FillSystemNamesContainer()
{
    if (this.readyState == 4 && this.status == 200)
    {
	var res = this.responseText;
	var resJSON = JSON.parse(res);
	var i, NumOfSystems, Systems, checkbox, label, container, br;
	Systems = resJSON[document.querySelector("#date-input").value];
	MachineId_IpHostname = {};
	UniqueSystemNames = Object.keys(Systems);
	UniqueSystemNames.sort();
	NumOfSystems = Object.keys(Systems).length;
	container = document.getElementById('system-names-container');
	//clearing it initially
	while (container.firstChild) {
	    container.firstChild.remove()
	}
	//Adding new elements
	for(i=0; i<NumOfSystems; i++)
	{
	    MachineId_IpHostname[UniqueSystemNames[i]] = Systems[UniqueSystemNames[i]]['address']+'-'+Systems[UniqueSystemNames[i]]['hostname'];
	    
	    checkbox = document.createElement('input');
	    checkbox.type = 'checkbox';
	    checkbox.id = 'checkbox-'+UniqueSystemNames[i];
	    checkbox.machine_id = UniqueSystemNames[i];
	    checkbox.name = 'checkbox-'+UniqueSystemNames[i];
	    checkbox.value = Systems[UniqueSystemNames[i]]['address']+'-'+Systems[UniqueSystemNames[i]]['hostname'];
	    checkbox.onclick = CheckboxClicked;
	    
	    label = document.createElement('label')
	    label.htmlFor = 'checkbox-'+UniqueSystemNames[i];
	    label.appendChild(document.createTextNode(Systems[UniqueSystemNames[i]]['address']+'-'+Systems[UniqueSystemNames[i]]['hostname']));
	    
	    br=document.createElement('br');
	    
	    container.appendChild(checkbox);
	    container.appendChild(label);
	    container.appendChild(br);
	}
    }
}

function CheckboxClicked(event)
{    
    var checkbks_all = document.querySelectorAll("#system-names-container input[type='checkbox']");
    for(i=0; i<checkbks_all.length; i++)
	{
	    checkbks_all[i].disabled=false;
	} 
    var checkbks = document.querySelectorAll("#system-names-container input[type='checkbox']:checked");
    if(checkbks.length>=5)
    {
	var checkbks_to_disable = document.querySelectorAll("#system-names-container input[type='checkbox']:not(:checked)");
	for(i=0; i<checkbks_to_disable.length; i++)
	{
	    checkbks_to_disable[i].disabled=true;
	}
	
    }
    
    xhr_object_01 = new XMLHttpRequest();
    xhr_object_01.onload = Update_CPU_ydata;
    xhr_object_01.open('GET', 'http://'+document.BACKEND_URL+'/api/v1/get-cpu-usage/'+document.getElementById('date-input').value+'/'+event.target.machine_id);
    xhr_object_01.send();

    xhr_object_02 = new XMLHttpRequest();
    xhr_object_02.onload = Update_RAM_ydata;
    xhr_object_02.open('GET', 'http://'+document.BACKEND_URL+'/api/v1/get-mem-usage/'+document.getElementById('date-input').value+'/'+event.target.machine_id);
    xhr_object_02.send();

    xhr_object_03 = new XMLHttpRequest();
    xhr_object_03.onload = Update_Logins_data;
    xhr_object_03.open('GET', 'http://'+document.BACKEND_URL+'/api/v1/get-login-details/'+document.getElementById('date-input').value+'/'+event.target.machine_id);
    xhr_object_03.send();    


    if(CurrentTab == "CPU")
    {
	_FillCPUChart();
    }
    else if(CurrentTab == "RAM")
    {
	_FillRAMChart();
    }
    else if(CurrentTab == "Logins")
    {
	_FillLoginsChart();
    }
}

function Update_CPU_ydata()
{
    if (this.readyState == 4 && this.status == 200)
    {
	var res = this.responseText;
	var resJSON = JSON.parse(res);
	CPU_ydata = {...CPU_ydata, ...resJSON[document.getElementById('date-input').value]};
    
	if(CurrentTab == "CPU")
	{
	    _FillCPUChart();
	}
    }
}

function Update_RAM_ydata()
{
    if (this.readyState == 4 && this.status == 200)
    {
	var res = this.responseText;
	var resJSON = JSON.parse(res);
	RAM_ydata = {...RAM_ydata, ...resJSON[document.getElementById('date-input').value]};
	if(CurrentTab == "RAM")
	{
	    _FillRAMChart();
	}
    }
}

function Update_Logins_data()
{
    if(this.readyState == 4 && this.status == 200)
    {
	var res = this.responseText;
	var resJSON = JSON.parse(res);
	Logins_data = {...Logins_data, ...resJSON[document.getElementById('date-input').value]};
	if(CurrentTab == "Logins")
	{
	    _FillLoginsChart();
	}
    }
}

function _FillLoginsChart()
{
    document.getElementById("Logins").innerHTML = "";

    var i, d;    
    var checkbks = document.querySelectorAll("#system-names-container input[type='checkbox']:checked");

    var machines_selected = [];
    for(i=0; i<checkbks.length; i++)
    {
	machines_selected.push(checkbks[i].id.split("-")[1]);
    }
    for(i=0; i<machines_selected.length; i++)
    {
	if(machines_selected[i] in Logins_data)
	{
	    document.getElementById("Logins").innerHTML += "<span style='font-size: 18px; color: #ff1e00; font-family: Monospace;'>" + MachineId_IpHostname[machines_selected[i]] + ": </span> <br>";
	    document.getElementById("Logins").innerHTML += "<pre>" + Logins_data[machines_selected[i]].replaceAll("\n", "<br>") + "</pre> <br>";
	}
    }
}


function _FillCPUChart()
{
    var i, d;
    
    var checkbks = document.querySelectorAll("#system-names-container input[type='checkbox']:checked");

    var machines_selected = [];
    for(i=0; i<checkbks.length; i++)
    {
	machines_selected.push(checkbks[i].id.split("-")[1]);
    }

    var x_data = [...Array(24).keys()];
    var y_data = {};
    for(i=0; i<machines_selected.length; i++)
    {
	if(machines_selected[i] in CPU_ydata)
	{
	    y_data[machines_selected[i]]=CPU_ydata[machines_selected[i]];
	}
    }
    var colors = ["#3e95cd", "#8e5ea2", "#3cba9f",  "#e8c3b9", "#c45850" ]; //JSONify it

    var systems = Object.keys(y_data)
    systems.sort()

    my_dataset = [];
    for(i=0; i<systems.length; i++)
    {
	d = {data: y_data[systems[i]],
	     label: systems[i],
	     borderColor: colors[i],
	     fill: false }
	my_dataset.push(d);
    }
    
    new Chart(document.getElementById("CPU-chart"), {
  type: 'line',
  data: {
    labels: x_data,
    datasets: my_dataset
        }, 
  options: {
    title: {
      display: true,
	text: 'CPU Utilization                             ',
	fontColor: '#ff1e00',
	fontSize: 20,
	horizontalAlign: "right"
           },
      scales: {
	  yAxes: [ {
	          ticks: {
		     beginAtZero: true,
		      min:0,
		      max:100,
		      stepsize:10
         		  },
	       scaleLabel: {
		   display: true,
		   labelString: 'CPU Utilization (%)'
	       }
	  } ],
	  xAxes : [ {
	      scaleLabel: {
		  display: true,
		  labelString: 'Time (hrs)'
	      }
	  } ]
      },
      legend: {
      position: 'right'
             }
  }
    });

}


function _FillRAMChart()
{
    var i, d;
    var checkbks = document.querySelectorAll("#system-names-container input[type='checkbox']:checked");

    var machines_selected = [];
    for(i=0; i<checkbks.length; i++)
    {
	machines_selected.push(checkbks[i].id.split("-")[1]);
    }
    
    var x_data = [...Array(24).keys()];
    var y_data = {};
    //{"blossom@10.10.3.157":[9.81, 4.84, 1.92, 1.76, 5.61, 10.73, 18.78, 29.21, 80.61, 24.98, 25.83, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3.24, 1.58, 8.17, 5.42, 3.73, 2.05, 2.74, 3.55, 3.29, 2.04, 1.56, 1.45, 0.55, 1.41, 1.68, 1.6, 3.97, 2.08, 1.97, 14.37, 4.84, 3.09, 5.37, 1.85, 1.75, 1.95, 1.97, 12.34, 11.77, 6.1, 2.79, 7.12, 3.79, 3.9, 5.52, 2.63, 7.71, 13.81, 14.33, 13.64, 10.59, 6.9, 0.63, 2.16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14.4, 7.83, 7.35, 3.63, 22.21, 23.37, 21.66, 10.69, 3.44, 3.18, 3.28, 3.55, 3.51, 3.53, 3.62, 3.39, 3.42, 3.44, 3.29, 6.28, 9.81, 10.21, 8.57, 2.07, 1.17, 0.9, 3.52, 0, 0, 0, 0], "rover@10.10.3.158":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17.86, 16.19, 15.1, 15.89, 21.09, 20.71, 24.15, 24.34, 14.8, 14.15, 15.27, 14.24, 15.08, 17.65, 16.93, 12.44, 14.87, 12.42, 12.19, 0, 0, 0, 0, 0, 0, 29.62, 7.86, 1.92, 0, 0, 0, 19.18, 19.61, 14.82, 13.89, 13.91, 14.03, 14.39, 14.07, 17.37, 16.15, 16.22, 15.18, 18.74, 20.01, 14.5, 13.21, 16.28, 19.27, 0, 0, 0, 0, 0, 0, 0, 33.72, 14.49, 11.52, 10.85, 1.77, 10.36, 22.39, 17.92, 12.89, 12.73, 12.0, 15.02, 16.21, 12.38, 0, 0, 0, 0, 0, 17.49, 17.64, 11.51, 10.92, 11.42, 11.64, 10.57, 11.1, 29.96, 30.51, 0, 0, 0]}; //JSONify it

    for(i=0; i<machines_selected.length; i++)
    {
	if(machines_selected[i] in RAM_ydata)
	{
	    y_data[machines_selected[i]]=RAM_ydata[machines_selected[i]];
	}
    }
    
    var colors = ["#3e95cd", "#8e5ea2", "#3cba9f",  "#e8c3b9", "#c45850" ]; //JSONify it

    var systems = Object.keys(y_data)
    systems.sort()

    my_dataset = [];
    for(i=0; i<systems.length; i++)
    {
	d = {data: y_data[systems[i]],
	     label: systems[i],
	     borderColor: colors[i],
	     fill: false }
	my_dataset.push(d);
    }
    
    new Chart(document.getElementById("RAM-chart"), {
  type: 'line',
  data: {
    labels: x_data,
    datasets: my_dataset
        }, 
  options: {
    title: {
      display: true,
	text: 'RAM Utilization                             ',
	fontColor: '#ff1e00',
	fontSize: 20
           },
      scales: {
	  yAxes: [ {
	          ticks: {
		     beginAtZero: true,
		      min:0,
		      max:100,
		      stepsize:10
         		  },
	       scaleLabel: {
		   display: true,
		   labelString: 'RAM Utilization (%)'
	       }
	  } ],
	  xAxes : [ {
	      scaleLabel: {
		  display: true,
		  labelString: 'Time (hrs)'
	      }
	  } ]
      },
      legend: {
      position: 'right'
             }
  }
    });

}

function _SetDefaultDateToYesterday()
{
    var yesterday_date = new Date(new Date().setDate(new Date().getDate()-1));
    var min_date = new Date(new Date().setDate(new Date().getDate()-30));
    var max_date = yesterday_date;
    document.querySelector("#date-input").value = yesterday_date.toISOString().substr(0, 10);
    document.querySelector("#date-input").min = min_date.toISOString().substr(0, 10);
    document.querySelector("#date-input").max = max_date.toISOString().substr(0, 10);
}

function UpdateNumberOfSystems()
{
	  if (this.readyState == 4 && this.status == 200){
	      var res = this.responseText;
	      var resJSON = JSON.parse(res);
	      document.getElementById("NumOfSystems").innerHTML = Object.keys(resJSON[document.querySelector("#date-input").value]).length;
	  }
}

function LogDateModified(event)
{
    var other_machine_live_ssh_check_div = document.getElementById('other-machine-live-ssh-check-div');
    if (other_machine_live_ssh_check_div != null){
	other_machine_live_ssh_check_div.remove();
    }
    
    //Update the number of systems
    xhr_object = new XMLHttpRequest();
    xhr_object.onload = UpdateNumberOfSystems;
    xhr_object.open('GET', 'http://'+document.BACKEND_URL+'/api/v1/get-machines/'+document.getElementById('date-input').value);
    xhr_object.send();
    //Update the System Names and IPs checkbox container
    xhr_object_01 = new XMLHttpRequest();
    xhr_object_01.onload = _FillSystemNamesContainer;
    xhr_object_01.open('GET', 'http://'+document.BACKEND_URL+'/api/v1/get-machines/'+document.getElementById('date-input').value);
    xhr_object_01.send();
    //Update the CPU_ydata and RAM_ydata to {} and clear the logins information displayed.
    CPU_ydata = {};
    RAM_ydata = {};
    document.getElementById("Logins").innerHTML = "";
    if(CurrentTab == "SSH")
    {
	_SSHTabSelected();
	CurrentTab = "SSH";
	console.log("updated it again!!!")
    }
}
