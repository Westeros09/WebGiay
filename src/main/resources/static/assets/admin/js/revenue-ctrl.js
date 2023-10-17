app.controller("revenue-ctrl", function($scope, $http, $location) {

	$scope.selectedYear = null;
	$scope.initialize = function() {
		$http.get("/rest/revenue").then(resp => {
			$scope.years = resp.data;
			$scope.selectedYear = 2023; // Đặt năm 2023 làm năm mặc định
			$scope.getRevenueByYear(); // Gọi hàm để tải dữ liệu doanh thu ngay khi trang tải lên
		}).catch(error => {
			$location.path("/unauthorized");
		})
	}
	
	$scope.getRevenueByYear = function() {
		// Perform an API call to get revenue data for the selected year
		// Replace 'YOUR_API_URL' with the actual API endpoint
		$http.get("/rest/revenue/" + $scope.selectedYear)
			.then(function(response) {
				$scope.revenueItems = response.data;

				// Tạo mảng dataPoints sau khi dữ liệu đã được tải xong
				var dataPoints = [];
				$scope.revenueItems.forEach(function(item) {
					var xValue = item[0]; // Tháng
					var yValue = item[1]; // Doanh thu
					// Tạo một đối tượng chứa x và y và đẩy vào mảng dataPoints
					dataPoints.push({
						x: xValue,
						y: yValue
					});
					console.log("x: " + xValue + ", y: " + yValue);
				});
				console.log(dataPoints);

				var chart = new CanvasJS.Chart("chartContainer", {
					animationEnabled: true,
					exportEnabled: true,
					theme: "light1", // "light1", "light2", "dark1", "dark2"
					title: {
						text: "Proceed in year"
					},
					axisY: {
						includeZero: true,
						prefix: "$", //prefix tiền tố, suffix hậu tố
					},
					axisX: {
						interval: 1, // Chỉ hiển thị giá trị nguyên trên trục x
						prefix: "Tháng ",//prefix tiền tố, suffix hậu tố
						minimum: 1,
        				maximum: 12     
						//valueFormatString: "M",

					},
					data: [{
						type: "column", //change type to bar, line, area, pie, etc
						indexLabel: "${y}", //Shows y value on all Data Points
						indexLabelFontColor: "#5A5757", //màu
						indexLabelFontSize: 16, //font
						indexLabelPlacement: "outside", //Cho chữ ở đâu
						indexLabelWrap: true,
						dataPoints: dataPoints
					}],
				});
				chart.render();
			})
			.catch(function(error) {
				console.log('Error fetching revenue data:', error);
			});
	};

	$scope.initialize();
});

