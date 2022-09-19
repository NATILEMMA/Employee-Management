	var value ;
	let res;
	let d;
	let message;



	
	function fill_attendance(value){
		var myObj={status:value};

		let makecall = async()=>{
			// post to API
			
				res = await $.ajax({
					url: '/api/method/employee.api.fill_attendance',
					method: 'POST',
					data:myObj,
					headers: {
						'X-Frappe-CSRF-Token': frappe.csrf_token
					},
				});
				var message = res.message
				
				alert(message);
				document.location.reload(true);
				
			}	
		makecall();

	}
	function check_location_and_fill_attendance(value,select_value){
		lat = value.lat;
		lon = value.lon; 
		var myObj={status:select_value,latitude:lat,longitude:lon};
		console.log(myObj);

		let makecall = async()=>{
			// post to API
			
				res = await $.ajax({
					url: '/api/method/employee.api.check_location_and_fill_attendance',
					method: 'POST',
					data:myObj,
					headers: {
						'X-Frappe-CSRF-Token': frappe.csrf_token
					},
				});
				var message = res.message
				
				alert(message);
				document.location.reload(true);
				
			}	
		makecall();

	}
	
	// document.getElementById("logout_link").addEventListener("click", function(e){
		
	// 	var myObj={"status":"logout"};
	// 	let makecall = async()=>{
	// 		// post to API
			
	// 			res = await $.ajax({
	// 				url: '/api/method/employee.api.logout',
	// 				method: 'POST',
	// 				data:myObj,
	// 				headers: {
	// 					'X-Frappe-CSRF-Token': frappe.csrf_token
	// 				},
	// 			});
	// 			var message = res.message
	// 		}	
	// 	makecall();
		
		
	// });

	document.getElementById("punch_attendance").addEventListener("submit", function(e){
		
		e.preventDefault();
		

	let makecall = async()=>{
		// post to API
		
			res = await $.ajax({
				url: '/api/method/employee.api.punchAttendance',
				method: 'POST',
				headers: {
					'X-Frappe-CSRF-Token': frappe.csrf_token
				},
			});
			var message = res.message
			
			alert(message);
			document.location.reload(true);
			
		}	
	makecall();	
	});
	document.getElementById("fill_attendance").addEventListener("submit", function(e){
		
		
		e.preventDefault();
	//sample status variable --will be replaced with the html select option
	var select = document.getElementById('attendance_status');
	select_value = select.options[select.selectedIndex].value;
	console.log(select_value);
	
	var lat,lon;
	if (select_value == "Present"){

		var promise1 = new Promise(function(resolve, reject) {

		const options = {
			enableHighAccuracy: true,
			timeout: 50000000,
			maximumAge: 0
		  };
		  
				
				function getLocation() {
				  if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(showPosition, showError,options);
		
				  } else {
					alert("The Browser Does not Support Geolocation"); 
				  }
				  
				}
		  
				function showPosition(position) {
					lat = position.coords.latitude;
					lon = position.coords.longitude;
					resolve({lat,lon});
				}
		  
				function showError(error) {
				  if(error.PERMISSION_DENIED){
					alert("The User have denied the request for Geolocation.");
				  }
				}
			getLocation();
	
	})
		
		promise1.then(function(value) {
			check_location_and_fill_attendance(value,select_value); 
			
		});
		
	}else{
		
		fill_attendance(select_value);
		console.log("I am in fill attendance else and its false");
	}
		return true;
	});

	
	


/*
window.onload=function(){
	
		
	document.getElementById("fill_attendance").addEventListener("submit", function(e){
		
		e.preventDefault();
	
		//sample status variable --will be replaced with the html select option
		var select = document.getElementById('attendance_status');
		value = select.options[select.selectedIndex].value;
		console.log(value); 
	
		var value;
		var myObj;
		frappe.call({ method: "frappe.client.get_value", 
		async:false, 
		args:{ doctype:'Employee', filters:{ name:frm.doc.owner }, fieldname:['employee','company'] }, 
		callback:function (r) { if(r.message != undefined){
	
			myObj = {status:value,employee: r.message.employee,company:r.message.company};
			console.log(myObj) } } }); 
	
		 
	
	
	// post to API
		let res = await $.ajax({
			url: '/api/method/employee.api.fill_attendance',
			method: 'POST',
			data:myObj,
			headers: {
				'Content-Type': 'application/json',
				'X-Frappe-CSRF-Token': frappe.csrf_token
			},
		});
		console.log(res);
		return false;
		
	});
	}
	
	
	*/