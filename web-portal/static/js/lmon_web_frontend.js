var CurrentTab = "";
var CPU_ydata = {};
var RAM_ydata = {};
var Logins_data = {};
var MachineId_IpHostname = {};

function InAggregate_openTab(event, subTabName){
    console.log(subTabName);
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks, tabdots;
    var TabDotToACtivate;
    
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

function _FillSSHData()
{
    var failed_ssh = {"10.10.1.31":{"hostname":"bobsled", "user":"igroup"}, "10.10.1.32":{"hostname":"bobsled1", "user":"igroup1"}};
    var success_ssh = {"10.10.1.31":{"hostname":"bobsled", "user":"igroup"}, "10.10.1.32":{"hostname":"bobsled1", "user":"igroup1"}};
    
    var failed_ssh_table = document.createElement('table');
    failed_ssh_table.setAttribute('id', 'failed_ssh_table');
    failed_ssh_table.setAttribute('class', 'failed_ssh_table');
    document.getElementById("SSH").appendChild(failed_ssh_table);
    //console.log(document.getElementById('failed_ssh_table'));
    var failed_ssh_caption = document.getElementById('failed_ssh_table').createCaption();
    failed_ssh_caption.innerHTML = "<span style='font-size: 18px; color: #000080; font-family: Monospace;'>" + "SSH failed for:<br>";

    var success_ssh_table = document.createElement('table');
    success_ssh_table.setAttribute('id', 'success_ssh_table');
    document.getElementById("SSH").appendChild(success_ssh_table);
    var success_ssh_caption = document.getElementById('success_ssh_table').createCaption();
    success_ssh_caption.innerHTML = "<span style='font-size: 18px; color: #000080; font-family: Monospace;'>" + "<br>SSH succeeded for:<br>";

    var arrHead = new Array();
    arrHead = ['Sl.No.', 'IP Address', 'Hostname', 'SSH tried for User'];

    var failed_ssh_tr = failed_ssh_table.insertRow(-1);
    var success_ssh_tr = success_ssh_table.insertRow(-1);
    
    //table header
    for(var h=0; h<arrHead.length; h++){
	var failed_ssh_th = document.createElement('th');
	failed_ssh_th.innerHTML = "<span style='font-size: 15px; color: #7b241c; font-family: Monospace;'>" + "  "+arrHead[h]+"  ";
	failed_ssh_tr.appendChild(failed_ssh_th);
    }
    
    for(var h=0; h<arrHead.length;h++){
	var success_ssh_th = document.createElement('th');
	success_ssh_th.innerHTML = "<span style='font-size: 15px; color: #145a32; font-family: Monospace;'>" + "  "+arrHead[h]+"  ";
	success_ssh_tr.appendChild(success_ssh_th);
    }

    var failed_IPs = Object.keys(failed_ssh);
    var success_IPs = Object.keys(success_ssh);
    //console.log(failed_IPs.length);
    
    for(var c=0; c<failed_IPs.length; c++) {
	failed_ssh_tr = failed_ssh_table.insertRow(-1);

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
    }
    
    for(var c=0; c<success_IPs.length; c++) {
	success_ssh_tr = success_ssh_table.insertRow(-1);

	var td_1 = document.createElement('td');
	td_1 = success_ssh_tr.insertCell(-1);
	td_1.innerHTML = "<span style='font-size: 13px; color: #28b463; font-family: Monospace;text-align: center; display:block;'>" + (c+1).toString();
	success_ssh_tr.appendChild(td_1);

	var td_2 = document.createElement('td');
	td_2 = success_ssh_tr.insertCell(-1);
	td_2.innerHTML = "<span style='font-size: 13px; color: #28b463; font-family: Monospace;text-align: center; display:block;'>" + success_IPs[c];
	success_ssh_tr.appendChild(td_2);

	var td_3 = document.createElement('td');
	td_3 = success_ssh_tr.insertCell(-1);
	td_3.innerHTML = "<span style='font-size: 13px; color: #28b463; font-family: Monospace;text-align: center; display:block;'>" + success_ssh[success_IPs[c]]["hostname"];
	success_ssh_tr.appendChild(td_3);

	var td_4 = document.createElement('td');
	td_4 = success_ssh_tr.insertCell(-1);
	td_4.innerHTML = "<span style='font-size: 13px; color: #28b463; font-family: Monospace;text-align: center; display:block;'>" + success_ssh[success_IPs[c]]["user"];
	success_ssh_tr.appendChild(td_4);
    }
    
    document.getElementById("SSH").appendChild(failed_ssh_table);
    //document.getElementById("SSH").innerHTML += "<span style='font-size: 18px; color: #000080; '>" + "<br>SSH succeeded for:<br>";
    document.getElementById("SSH").appendChild(success_ssh_table);
    
    document.getElementById('failed_ssh_table').border=1;
    document.getElementById('success_ssh_table').border=1;

}

function _SSHTabSelected()
{
    console.log("SSHTabSelected");
    var i;
    // var date_div_elems = document.getElementsByClassName("date-div");
    // for (i=0; i<date_div_elems.length; i++) {
    // 	date_div_elems[i].style.display = "none";
    // }
    // var system_names_elems = document.getElementsByClassName("system-names-titles-div");
    // for (i=0; i<system_names_elems.length; i++) {
    // 	system_names_elems[i].style.display = "none";
    // }
    // var system_names_elems_c = document.getElementsByClassName("system-names-container-div");
    // for (i=0; i<system_names_elems_c.length; i++) {
    // 	system_names_elems_c[i].style.display = "none";
    // }
    // document.getElementById("SSH").style.display = "none";

    document.getElementById("SSH").innerHTML = "";
    _FillSSHData();
    
    
}



function _AggregateTabSelected()
{
    console.log("AggregateTabSelected");
    var i;
    var date_div_elems = document.getElementsByClassName("date-div");
    for (i=0; i<date_div_elems.length; i++) {
	date_div_elems[i].style.display = "none";
    }
    var system_names_elems = document.getElementsByClassName("system-names-titles-div");
    for (i=0; i<system_names_elems.length; i++) {
	system_names_elems[i].style.display = "none";
    }
    var system_names_elems_c = document.getElementsByClassName("system-names-container-div");
    for (i=0; i<system_names_elems_c.length; i++) {
	system_names_elems_c[i].style.display = "none";
    }
    document.getElementById("Aggregate").style.display = "none";
    
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
}
