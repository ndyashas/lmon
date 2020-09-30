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
