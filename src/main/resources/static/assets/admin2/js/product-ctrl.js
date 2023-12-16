app.controller("product-ctrl", function($scope, $http) {
	$scope.items = [];
	$scope.form = {};
	$scope.formImg = {};
	$scope.productCounts = {};
	$scope.uploadedImageNames = [];
	$scope.filenames = [];

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
		$scope.uploadedImageNames = []; // Reset the number of uploaded files
		$scope.form.images = []; // Reset the number of uploaded files
		$scope.filenames = [];

	}


	var url = `http://localhost:8080/rest/files/images`;
	$scope.url = function(filename) {
		return `${url}/${filename}`;
	};

	$scope.list = function() {
		$http
			.get(url)
			.then((resp) => {
				$scope.filenames = resp.data;
			})
			.catch((error) => {
				console.log("Error", error);
			});
	};

	$scope.deleteImage = function(filename) {
		$http.delete(`${url}/${filename}`)
			.then((resp) => {
				let i = $scope.filenames.findIndex((name) => name == filename);
				$scope.filenames.splice(i, 1);
				// Xóa tên file ảnh khỏi danh sách uploadedImageNames
				$scope.deleteUploadedImageName(filename);
				$scope.reduceImageInputCount();
			})
			.catch((error) => {
				console.log("Error", error);
			});
	};

	// Hàm xóa tên ảnh khỏi danh sách uploadedImageNames
	$scope.deleteUploadedImageName = function(imageName) {
		let i = $scope.uploadedImageNames.findIndex((name) => name == imageName);
		if (i !== -1) {
			$scope.uploadedImageNames.splice(i, 1);
		}
	};
	
	$scope.upload = function(files) {
		var form = new FormData();
		for (let i = 0; i < files.length; i++) {
			form.append("files", files[i]);
		}
		$http
			.post(url, form, {
				transformRequest: angular.identity,
				headers: { "Content-Type": undefined },
			})
			.then((resp) => {
				$scope.filenames.push(...resp.data);
				$scope.uploadedImageNames.push(...resp.data);
			})
			.catch((error) => {
				console.log("Error", error);
			});
	};

	/*	$scope.list();
	*/
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
		}
		$scope.filenames = []; // Làm cho $scope.filenames trở thành một mảng rỗng
		$scope.uploadedImageNames = []; // Reset số lượng file
		$scope.form.images = []; // Reset số lượng file
		$scope.images = [];
		var input = document.getElementById('imageInput');
		input.value = ''; // Clear the selected files

	}


	$scope.create = function() {
		var item = angular.copy($scope.form);
		$http.post(`/rest/products`, item).then(resp => {
			console.log("Thông tin sản phẩm mới:", resp.data); // Log thông tin sản phẩm mới vào console

			$scope.items.push(resp.data);
			console.log("Tên của các ảnh đã được upload:", $scope.uploadedImageNames);

			$scope.createImg(resp.data.id);
			console.log(resp.data.id);

			$scope.reset();

			alert("Thêm mới sản phẩm thành công!");
			$scope.initialize();
		}).catch(error => {
			alert("Lỗi thêm mới sản phẩm!");
			console.log("Error", error);
		});
	};

	$scope.update = function() {
		var item = angular.copy($scope.form);

		$http.put(`/rest/products/${item.id}`, item).then(resp => {
			var index = $scope.items.findIndex(p => p.id == item.id);
			$scope.items[index] = item;

			// Thực hiện xóa ảnh cũ và upload 3 ảnh mới
			if ($scope.filenames.length > 0) {
				console.log($scope.filenames.length);
				// If new images are selected, delete old images and upload new images
				$scope.deleteOldImages(item.id);
				$scope.uploadNewImages(item.id);
			}
			$scope.reset();
			alert("Cập nhật sản phẩm thành công!");
			$scope.initialize();
		}).catch(error => {
			alert("Lỗi cập nhật sản phẩm!");
			console.log("Error", error);
		});
	}

	$scope.deleteOldImages = function(product_id) {
		// Lấy danh sách ảnh cũ từ cơ sở dữ liệu và xóa chúng
		$http.get(`/rest/images/products/${product_id}`).then(resp => {
			var oldImages = resp.data;

			oldImages.forEach(oldImage => {
				$http.delete(`/rest/images/${oldImage.id}`).then(resp => {
					console.log("Đã xóa ảnh cũ:", oldImage.id);
				}).catch(error => {
					console.log("Lỗi xóa ảnh cũ:", error);
				});
			});
		}).catch(error => {
			console.log("Lỗi lấy danh sách ảnh cũ:", error);
		});
	}

	$scope.uploadNewImages = function(product_id) {
		// Lấy danh sách 3 ảnh mới từ giao diện người dùng và upload chúng
		var newImages = angular.copy($scope.uploadedImageNames);

		newImages.forEach(newImage => {
			if (newImage) {
				var imageCopy = {
					image: newImage,
					product: { id: product_id }
					// Các thông tin khác nếu cần
				};

				$http.post(`/rest/images`, imageCopy).then(resp => {
					console.log("Đã upload ảnh mới:", newImage);
				}).catch(error => {
					console.log("Lỗi upload ảnh mới:", error);
				});
			}
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




	$scope.createImg = function(product_id) {
		var imagesCopy = angular.copy($scope.uploadedImageNames);
		$http.get(`/rest/products/${product_id}`)
			.then(response => {
				var product = response.data;
				// Sử dụng thông tin sản phẩm nếu cần
				console.log("Thông tin sản phẩm:", product);

				// Kiểm tra xem có hình ảnh nào để thêm hay không
				if (imagesCopy && imagesCopy.length > 0) {
					// Sử dụng vòng lặp để thêm từng ảnh vào cơ sở dữ liệu
					for (var i = 0; i < imagesCopy.length; i++) {
						var imageCopy = {
							image: imagesCopy[i],
							product: product  // Gán productId cho mỗi ảnh
							// Các thông tin khác nếu cần
						};
						$http.post(`/rest/images`, imageCopy)
							.then(resp => {
								console.log("Phản hồi từ API khi thêm ảnh:", resp.data);
								$scope.images.push(resp.data);
								$scope.reset();
							})
							.catch(error => {
								alert("Lỗi thêm mới hình ảnh!");
								console.log("Error", error);
							});
					}
				} else {
					alert("Không có hình ảnh để thêm!");
				}

			})
			.catch(error => {
				console.error("Lỗi khi lấy thông tin sản phẩm:", error);
				// Xử lý lỗi nếu cần
			});
	};

	$scope.updateImg = function() {

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


	$scope.initialize();


});