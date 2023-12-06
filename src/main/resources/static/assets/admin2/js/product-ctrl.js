app.controller("product-ctrl", function($scope, $http) {
	$scope.items = [];
	$scope.form = {};
	$scope.formImg = {};
	$scope.productCounts = {};

	$scope.initialize = function() {
		$http.get("/rest/categories").then(resp => {
			$scope.categories = resp.data;
		})
		$http.get("/rest/discountSale").then(resp => {
			$scope.discountSale = resp.data;
		})

		$http.get("/rest/products").then(resp => {
			$scope.items = resp.data;
		});
		$http.get("/rest/images").then(resp => {
			$scope.images = resp.data; // Đảm bảo rằng dữ liệu được gán đúng tại đây
		});

		$scope.reset(); //để có hình mây lyc1 mới đầu
		$scope.loadCurrentUser();
	}
	
	$scope.loadCurrentUser = function() {
    $http.get("/rest/accounts/current-account").then(resp => {
        $scope.account = resp.data;
    }); 
};
	$scope.edit = function(item) {
		$scope.form = angular.copy(item);
		$scope.form.images = []; // Khởi tạo thuộc tính images là một mảng trống
		$http.get(`/rest/images/products/${item.id}`).then(resp => {
			$scope.form.images = resp.data; // Gán dữ liệu ảnh trả về vào thuộc tính images
			console.log($scope.form.images);
		});
	}

	$scope.imageChanged = function(files) {
		var data = new FormData();
		data.append('file', files[0]);
		$http.post('/rest/upload/images', data, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(resp => {
			if (resp.data && resp.data.name) {
				$scope.formImg.image = resp.data.name; // Sử dụng tên hình ảnh từ phản hồi
				console.log(resp.data.name);
			} else {
				alert("Không thể lấy tên hình ảnh từ phản hồi");
			}
		}).catch(error => {
			alert("Lỗi upload hình ảnh");
			console.log("Error", error);
		});
	};

	$scope.reset = function() {
		$scope.form = {
			available: true,
			image: "cloud-upload.jpg"
		}
		$scope.formImg = {
			available: true,
			image: "cloud-upload.jpg"
		}
	}

	$scope.create = function() {
		var item = angular.copy($scope.form);
		$http.post(`/rest/products`, item).then(resp => {
			$scope.items.push(resp.data);
			$scope.reset();

			alert("Thêm mới sản phẩm thành công!");

		}).catch(error => {
			alert("Lỗi thêm mới sản phẩm!");
			console.log("Error", error);
		});
	}

	$scope.update = function() {
		var item = angular.copy($scope.form);
		$http.put(`/rest/products/${item.id}`, item).then(resp => {
			var index = $scope.items.findIndex(p => p.id == item.id);
			$scope.items[index] = item;
			alert("Cập nhật sản phẩm thành công!");
		})
			.catch(error => {
				alert("Lỗi cập nhật sản phẩm!");
				console.log("Error", error);
			});
	}

	$scope.delete = function(item) {
		var itemCopy = angular.copy(item);

		$http({
			method: 'DELETE',
			url: '/rest/products/' + itemCopy.id
		}).then(function successCallback(response) {
			var index = $scope.items.findIndex(p => p.id === itemCopy.id);
			if (index !== -1) {
				$scope.items.splice(index, 1);
				$scope.reset();
				alert("Xóa sản phẩm thành công!");
			}
		}, function errorCallback(error) {
			// Nếu không xóa được, thực hiện cập nhật trạng thái
			itemCopy.available = false;
			$http({
				method: 'PUT',
				url: `/rest/products/${itemCopy.id}`,
				data: itemCopy
			}).then(function successCallback(response) {
				var index = $scope.items.findIndex(p => p.id === itemCopy.id);
				if (index !== -1) {
					$scope.items[index] = itemCopy;
					alert("Cập nhật trạng thái thành công!");
				}
			}, function errorCallback(updateError) {
				// Handle the error for the status update here if needed
				alert("Cập nhật trạng thái không thành công!");
			});
		});
	};







	$scope.editImg = function(image) {
		$scope.formImg = angular.copy(image);
		$scope.formImg.image = image.image;
	}

	$scope.createImg = function() {
		/*var imageCopy = angular.copy($scope.form);
		$http.post(`/rest/images`, imageCopy).then(resp => {
			$scope.images.push(resp.data);
			$scope.reset();
			alert("Thêm mới hình ảnh thành công!");
		}).catch(error => {
			alert("Lỗi thêm mới hình ảnh!");
			console.log("Error", error);
		});*/
		var imageCopy = angular.copy($scope.formImg);
		var existingImageIndex = -1;

		// Kiểm tra xem hình ảnh đã tồn tại hay chưa
		for (var i = 0; i < $scope.images.length; i++) {
			if ($scope.images[i].image === imageCopy.image) {
				existingImageIndex = i;
				break;
			}
		}
		if (existingImageIndex > -1) {
			// Nếu hình ảnh đã tồn tại, cập nhật hình ảnh
			alert('Ảnh này đã tồn tại trong sản phẩm bạn thêm!');
		} else {
			// Nếu hình ảnh chưa tồn tại, thêm hình ảnh mới
			$http.post(`/rest/images`, imageCopy).then(resp => {
				$scope.images.push(resp.data);
				$scope.reset();
				alert("Thêm mới hình ảnh thành công!");
			}).catch(error => {
				alert("Lỗi thêm mới hình ảnh!");
				console.log("Error", error);
			});
		}
	};

	$scope.updateImg = function() {
		/*var image = angular.copy($scope.form);
		var index = $scope.images.findIndex(i => i.id == image.id);


		$http.put(`/rest/images/${image.id}`, image).then(resp => {
			$scope.images[index] = image;
			alert("Cập nhật hình ảnh thành công!");
		}).catch(error => {
			alert("Lỗi cập nhật hình ảnh!");
			console.log("Error", error);
		});*/
		var image = angular.copy($scope.formImg);
		var existingImageIndex = -1;

		// Kiểm tra xem hình ảnh đã tồn tại hay chưa
		for (var i = 0; i < $scope.images.length; i++) {
			if ($scope.images[i].image === image.image) {
				existingImageIndex = i;
				break;
			}
		}

		if (existingImageIndex > -1) {
			// Nếu hình ảnh đã tồn tại, hiển thị cảnh báo
			alert('Ảnh này đã tồn tại trong sản phẩm bạn thêm!');
		} else {
			// Nếu hình ảnh chưa tồn tại, tiến hành cập nhật
			$http.put(`/rest/images/${image.id}`, image).then(resp => {
				var index = $scope.images.findIndex(i => i.id === image.id);
				$scope.images[index] = image;
				alert("Cập nhật hình ảnh thành công!");
			}).catch(error => {
				alert("Lỗi cập nhật hình ảnh!");
				console.log("Error", error);
			});
		}
	};

	$scope.deleteImg = function(image) {
		if (confirm("Bạn muốn xóa ảnh của sản phẩm này?")) {
			$http.delete(`/rest/images/${image.id}`).then(resp => {
				var index = $scope.items.findIndex(p => p.id == image.id);
				$scope.items.splice(index, 1);
				$scope.reset();
				$scope.initialize();
				alert("Xóa ảnh thành công!");
			}).catch(error => {
				console.log("Error occurred while deleting the image:", error);
				alert("Lỗi xóa ảnh!");
				console.log("Error", error);
			})
		}
	};

	$scope.pagerImg = {
		page: 0,
		size: 3,
		get images() {
			if (this.page < 0) {
				this.lastImg();
			}
			if (this.page >= this.countImg) {
				this.firstImg();
			}
			var start = this.page * this.size;
			if ($scope.images && Array.isArray($scope.images)) {
				return $scope.images.slice(start, start + this.size);
			} else {
				return [];
			}
		},
		get countImg() {
			if ($scope.images && $scope.images.length) {
				return Math.ceil(1.0 * $scope.images.length / this.size);
			} else {
				return 0;
			}
		},
		firstImg() {
			this.page = 0;
		},
		lastImg() {
			this.page = this.countImg - 1;
		},
		nextImg() {
			this.page++;
		},
		prevImg() {
			this.page--;
		}
	};


	$scope.pager = {
		page: 0,
		size: 10,
		get items() {
			if (this.page < 0) {
				this.last();
			}
			if (this.page >= this.count) {
				this.first();
			}
			var start = this.page * this.size;
			return $scope.items.slice(start, start + this.size)
		},
		get count() {
			return Math.ceil(1.0 * $scope.items.length / this.size);
		},
		first() {
			this.page = 0;
		},
		last() {
			this.page = this.count - 1;
		},
		next() {
			this.page++;
		},
		prev() {
			this.page--;
		}
	}

	/*$scope.getProductCounts = function() {
		$http.get('http://localhost:8080/rest/products/counts').then(function(response) {
			$scope.productCounts = response.data;
			renderChart();
		}, function(error) {
			console.error('Error fetching product counts', error);
		});
	};
	$scope.getProductCounts();*/

	/*function renderChart() {
		var labels = Object.keys($scope.productCounts);
		var counts = Object.values($scope.productCounts);

		var data = {
			labels: labels,
			datasets: [{
				data: counts,
				backgroundColor: [
					'#FF6384',
					'#36A2EB',
					'#FFCE56'
				]
			}]
		};

		var ctx = document.getElementById('myChart').getContext('2d');
		var myChart = new Chart(ctx, {
			type: 'pie',
			data: data
		});
	}*/

	/*	$http.get("/rest/products/quantities")
			.then(function(response) {
				console.log(response.data); // Log the response data to check for any issues
	
				var data = response.data;
				var labelsBar = data.map(function(product) {
					return product.name;
				});
				var valuesBar = data.map(function(product) {
					return product.quantity;
				});
				var backgroundColorsBar = [
					'#FF6384',
					'#36A2EB',
					'#FFCE56',
					'#33FF99',
					'#FF99FF',
					'#9966FF',
					'#FF9933',
					'#99CCFF',
					'#FF6699',
					'#66FF99',
					'#FFCC99',
					'#66CCFF',
					'#FF99CC',
					'#99FFCC',
					'#FF6666'
				]; // Colors can be customized
	
				var ctxBar = document.getElementById('myChartBar').getContext('2d');
				var myChartBar = new Chart(ctxBar, {
					type: 'bar', // Change the type to 'bar' for quantities
					data: {
						labels: labelsBar,
						datasets: [{
							data: valuesBar,
							backgroundColor: backgroundColorsBar
						}]
					}
				});
			});
	*/
	$http.get("http://localhost:8080/rest/products/counts")
		.then(function(response) {
			var data = response.data;
			var labelsPie = Object.keys(data);
			var valuesPie = Object.values(data);
			var backgroundColorsPie = ['#FF6384', '#36A2EB', '#FFCE56']; // Colors can be customized

			var ctxPie = document.getElementById('myChartPie').getContext('2d');
			var myChartPie = new Chart(ctxPie, {
				type: 'pie', // Change the type to 'pie' for counts
				data: {
					labels: labelsPie,
					datasets: [{
						data: valuesPie,
						backgroundColor: backgroundColorsPie
					}]
				}
			});
		});








	/*	var data = {
			labels: ["Nike", "Adidas", "Puma"],
			datasets: [{
				data: [30, 20, 15, 10],
				backgroundColor: [
					"#FF6384",
					"#36A2EB",
					"#FFCE56"
		
				]
			}]
		};
		
		var ctx = document.getElementById('myCharttt').getContext('2d');
		var myChart = new Chart(ctx, {
			type: 'pie',
			data: data
		});
	*/
	$scope.initialize();





});