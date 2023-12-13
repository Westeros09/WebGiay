app.controller("dashboard-ctrl", function($scope, $http, $location) {
	$scope.selectedYear = null;
	$scope.initialize = function() {


		$http.get("/rest/revenue").then(resp => {
			$scope.years = resp.data;
			$scope.selectedYear = 2023; // Đặt năm 2023 làm năm mặc định
			$scope.getRevenueByYear(); // Gọi hàm để tải dữ liệu doanh thu ngay khi trang tải lên
		}).catch(error => {
			$location.path("/unauthorized");
		})
		// 4 BẢNG
		// Gọi API để lấy tổng doanh thu trong ngày, ngày hôm qua
		$http.get("/rest/revenue/today")
			.then(function(response) {
				if (response.data) {
					$scope.dailyRevenue = response.data;
				} else {
					$scope.dailyRevenue = 0;
				}
			})
			.catch(function(error) {
				console.error('Error fetching daily revenue data:', error);
			});
		$http.get("/rest/revenue/yesterday")
			.then(function(response) {
				if (response.data) {
					$scope.yesterdayRevenue = response.data;
				} else {
					$scope.yesterdayRevenue = 0;
				}
				var profitPercentage;
				if ($scope.yesterdayRevenue != 0) {
					profitPercentage = calculateProfitPercentage($scope.dailyRevenue, $scope.yesterdayRevenue);
				} else {
					profitPercentage = 100;
				}
				profitPercentage = Math.round(profitPercentage);
				$scope.profitPercentage = profitPercentage;

			})
			.catch(function(error) {
				console.error('Error fetching yesterday revenue data:', error);
			});
		// Hàm tính toán phần trăm lợi nhuận
		function calculateProfitPercentage(now, previous) {
			return ((now - previous) / previous) * 100;
		}

		// Gọi API để lấy  tổng số lượng sản phẩm bán ra trong tháng
		$http.get("/rest/revenue/saleVolume")
			.then(function(response) {
				if (response.data) {
					$scope.saleVolume = response.data;
				} else {
					$scope.saleVolume = 0;
				}
				

			})
			.catch(function(error) {
				console.error('Error fetching daily revenue data:', error);
			});
		$http.get("/rest/revenue/saleVolumePrevious")
			.then(function(response) {
				if (response.data) {
					$scope.saleVolumePrevious = response.data;
				} else {
					$scope.saleVolumePrevious = 0;
				}
				var quantityPercentage;
				if ($scope.saleVolumePrevious != 0) {
					quantityPercentage = calculateProfitPercentage($scope.saleVolume, $scope.saleVolumePrevious);
				} else {
					quantityPercentage = 100;
				}
				quantityPercentage = Math.round(quantityPercentage);
				$scope.quantityPercentage = quantityPercentage;
				
			})
			.catch(function(error) {
				console.error('Error fetching daily revenue data:', error);
			});

		// Gọi API để lấy AOV (tổng doanh thu/ tổng đơn) trong tháng
		$http.get("/rest/revenue/averageOrderValue")
			.then(function(response) {
				$scope.averageOrderValue = response.data; // Gán tổng doanh thu trong ngày vào biến $scope.dailyRevenue
			})
			.catch(function(error) {
				console.error('Error fetching daily revenue data:', error);
			});

		// Gọi API để lấy tổng doanh thu trong năm nnay
		$http.get("/rest/revenue/revenueYear")
			.then(function(response) {
				$scope.revenueYear = response.data; // Gán tổng doanh thu trong ngày vào biến $scope.dailyRevenue
			})
			.catch(function(error) {
				console.error('Error fetching daily revenue data:', error);
			});

		//BẢNG CITY
		// Gọi API để lấy thống kê city
		$http.get("/rest/revenue/city")
			.then(function(response) {
				$scope.cities = response.data;
				console.log('cities:', $scope.cities);
			})
			.catch(function(error) {
				console.error('Error fetching total quantity by category data:', error);
			});



		// BẢNG CATEGORY
		// Gọi API để lấy tổng số lượng hàng tồn kho theo danh mục
		$http.get("/rest/revenue/totalQuantityByCategory")
			.then(function(response) {
				$scope.totalQuantityByCategory = response.data;
				combineData(); // Gọi hàm combineData sau khi nhận được dữ liệu
			})
			.catch(function(error) {
				console.error('Error fetching total quantity by category data:', error);
			});

		// Gọi API để lấy tổng số lượng hàng đã bán theo danh mục
		$http.get("/rest/revenue/totalQuantitySoldByCategory")
			.then(function(response) {
				$scope.totalQuantitySoldByCategory = response.data;
				combineData(); // Gọi hàm combineData sau khi nhận được dữ liệu
			})
			.catch(function(error) {
				console.error('Error fetching total quantity sold by category data:', error);
			});


		function combineData() {
			if ($scope.totalQuantityByCategory && $scope.totalQuantitySoldByCategory) {
				console.log('totalQuantityByCategory:', $scope.totalQuantityByCategory);
				console.log('totalQuantitySoldByCategory:', $scope.totalQuantitySoldByCategory);
				// Kiểm tra xem cả hai mảng dữ liệu đã được nhận chưa
				$scope.combinedData = [];
				angular.forEach($scope.totalQuantityByCategory, function(category) {
					var categoryId = category[0];
					var quantityInStock = category[1];
					var soldQuantity;
					// Tìm số lượng đã bán tương ứng với danh mục
					angular.forEach($scope.totalQuantitySoldByCategory, function(soldItem) {
						if (soldItem[0] == categoryId) {
							soldQuantity = soldItem[1];
						}
					});
					// Thêm dữ liệu vào mảng combinedData
					$scope.combinedData.push({
						categoryId: categoryId,
						quantityInStock: quantityInStock,
						soldQuantity: soldQuantity
					});
				});
				console.log('combinedData:', $scope.combinedData);
			}
		}


		$scope.loadCurrentUser();
	}
	$scope.loadCurrentUser = function() {
		$http.get("/rest/accounts/current-account").then(resp => {
			$scope.account = resp.data;
		});
	};
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
						indexLabelFontSize: 14, //font
						indexLabelPlacement: "outside", //Cho chữ ở đâu
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

