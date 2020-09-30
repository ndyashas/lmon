function openTab(evt, tabName) {
    var i, tabcontent, tablinks, tabdots;
    var TabDotToACtivate;

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

    // ACtivate the appropriate tab's dot
    TabDotToActivate = document.getElementById(tabName+"-dot");
    TabDotToActivate.className += "activate";

    if(tabName == "CPU")
    {
	_FillCPUChart();
    }
}

function _FillSystemNamesContainer()
{
    var i, NumOfSystems, Systems, checkbox, label, container, br;
    Systems = {"rover":"10.10.3.158", "blossom":"10.10.3.157"}; //JSONIFY it
    UniqueSystemNames = Object.keys(Systems);
    UniqueSystemNames.sort();
    NumOfSystems = Object.keys(Systems).length;
    container = document.getElementById('system-names-container');
    for(i=0; i<NumOfSystems; i++)
    {
	checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.id = 'checkbox-'+UniqueSystemNames[i];
	checkbox.name = 'checkbox-'+UniqueSystemNames[i];
	checkbox.value = UniqueSystemNames[i]+'-'+Systems[UniqueSystemNames[i]];

	label = document.createElement('label')
	label.htmlFor = 'checkbox-'+UniqueSystemNames[i];
	label.appendChild(document.createTextNode(UniqueSystemNames[i]+'-'+Systems[UniqueSystemNames[i]]));

	br=document.createElement('br');

	container.appendChild(checkbox);
	container.appendChild(label);
	container.appendChild(br);
    }
}

function _FillCPUChart()
{
    var i, d;
    
    var x_data = [ 0.05 ,  0.15 ,  0.25 ,  0.35 ,  0.45 ,  0.55 , 1.05 , 1.15 , 1.25 ,  1.35 ,  1.45 ,  1.55 ,  2.05 ,  2.15 ,  2.25 ,  2.35 ,  2.45 ,  2.55 ,  3.05 ,  3.15 ,  3.25 ,  3.35 ,  3.45 ,  3.55 ,  4.05 ,  4.15 ,  4.25 ,  4.35 ,  4.45 ,  4.55 ,  5.05 ,  5.15 ,  5.25 ,  5.35 ,  5.45 ,  5.55 ,  6.05 ,  6.15 ,  6.25 ,  6.35 ,  6.45 ,  6.55 ,  7.05 ,  7.15 ,  7.25 ,  7.35 ,  7.45 ,  7.55 ,  8.05 ,  8.15 ,  8.25 ,  8.35 ,  8.45 ,  8.55 ,  9.05 ,  9.15 ,  9.25 ,  9.35 ,  9.45 ,  9.55 ,  10.05 ,  10.15 ,  10.25 ,  10.35 ,  10.45 ,  10.55 ,  11.05 ,  11.15 ,  11.25 ,  11.35 ,  11.45 ,  11.55 ,  12.05 ,  12.15 ,  12.25 ,  12.35 ,  12.45 ,  12.55 ,  13.05 ,  13.15 ,  13.25 ,  13.35 ,  13.45 ,  13.55 ,  14.05 ,  14.15 ,  14.25 ,  14.35 ,  14.45 ,  14.55 ,  15.05 ,  15.15 ,  15.25 ,  15.35 ,  15.45 ,  15.55 ,  16.05 ,  16.15 ,  16.25 ,  16.35 ,  16.45 ,  16.55 ,  17.05 ,  17.15 ,  17.25 ,  17.35 ,  17.45 ,  17.55 ,  18.05 ,  18.15 ,  18.25 ,  18.35 ,  18.45 ,  18.55 ,  19.05 ,  19.15 ,  19.25 ,  19.35 ,  19.45 ,  19.55 ,  20.05 ,  20.15 ,  20.25 ,  20.35 ,  20.45 ,  20.55 ,  21.05 ,  21.15 ,  21.25 ,  21.35 ,  21.45 ,  21.55 ,  22.05 ,  22.15 ,  22.25 ,  22.35 ,  22.45 ,  22.55 ,  23.05 ,  23.15 ,  23.25 ,  23.35 ,  23.45 ,  23.55 ];//JSONify it
    var y_data = {"blossom@10.10.3.157":[9.81, 4.84, 1.92, 1.76, 5.61, 10.73, 18.78, 29.21, 24.61, 24.98, 25.83, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3.24, 1.58, 8.17, 5.42, 3.73, 2.05, 2.74, 3.55, 3.29, 2.04, 1.56, 1.45, 0.55, 1.41, 1.68, 1.6, 3.97, 2.08, 1.97, 14.37, 4.84, 3.09, 5.37, 1.85, 1.75, 1.95, 1.97, 12.34, 11.77, 6.1, 2.79, 7.12, 3.79, 3.9, 5.52, 2.63, 7.71, 13.81, 14.33, 13.64, 10.59, 6.9, 0.63, 2.16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14.4, 7.83, 7.35, 3.63, 22.21, 23.37, 21.66, 10.69, 3.44, 3.18, 3.28, 3.55, 3.51, 3.53, 3.62, 3.39, 3.42, 3.44, 3.29, 6.28, 9.81, 10.21, 8.57, 2.07, 1.17, 0.9, 3.52, 0, 0, 0, 0], "rover@10.10.3.158":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17.86, 16.19, 15.1, 15.89, 21.09, 20.71, 24.15, 24.34, 14.8, 14.15, 15.27, 14.24, 15.08, 17.65, 16.93, 12.44, 14.87, 12.42, 12.19, 0, 0, 0, 0, 0, 0, 29.62, 7.86, 1.92, 0, 0, 0, 19.18, 19.61, 14.82, 13.89, 13.91, 14.03, 14.39, 14.07, 17.37, 16.15, 16.22, 15.18, 18.74, 20.01, 14.5, 13.21, 16.28, 19.27, 0, 0, 0, 0, 0, 0, 0, 33.72, 14.49, 11.52, 10.85, 1.77, 10.36, 22.39, 17.92, 12.89, 12.73, 12.0, 15.02, 16.21, 12.38, 0, 0, 0, 0, 0, 17.49, 17.64, 11.51, 10.92, 11.42, 11.64, 10.57, 11.1, 29.96, 30.51, 0, 0, 0]}; //JSONify it
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
      display: false,
      text: 'CPU Utilization'
    }
  },
	scaleOverride: true,
	scaleSteps: 10,
	scaleStepWidth: 10,
	scaleStartValue: 0
});

}
