app.controller("size-ctrl", function($scope, $http) {
	$scope.items = [];
	$scope.form = {};

	$scope.initialize = function() {
		$http.get("/rest/products").then(resp => {
			$scope.products = resp.data;
		})
		$http.get("/rest/sizeManager").then(resp => {
			$scope.items = resp.data;
		});
		$scope.reset(); //để có hình mây lyc1 mới đầu
		$scope.loadCurrentUser();
	}
	$scope.loadCurrentUser = function() {
		$http.get("/rest/accounts/current-account").then(resp => {
			$scope.account = resp.data;
		});
	};
	function validateForm() {
		if (!$scope.form.product || !$scope.form.product.id) {
			alert("Vui lòng chọn Product Id!");
			return false;
		}

		if (!$scope.form.sizes) {
			alert("Vui lòng chọn Size!");
			return false;
		}

		if (!$scope.form.quantity || $scope.form.quantity < 0) {
			alert("Vui lòng nhập Quantity hợp lệ!");
			return false;
		}
		if (!/^\d+$/.test($scope.form.quantity)) {
			alert("Quantity phải là số !");
			return false;
		}

		// Chuyển đổi quantity thành số và kiểm tra nó
		const quantity = parseInt($scope.form.quantity, 10);
		if (isNaN(quantity) || quantity < 0) {
			alert("Vui lòng nhập Quantity là số dương!");
			return false;
		}

		// Thêm các điều kiện kiểm tra khác nếu cần

		return true;
	}

	$scope.create = function() {
		if (validateForm()) {
			var item = angular.copy($scope.form);

			// Search for an item with the same `productId` and `sizes`
			var existingItem = $scope.items.find(function(existing) {
				return existing.product.id === item.product.id && existing.sizes === item.sizes;
			});

			if (existingItem) {
				// If a matching item is found, update its quantity
				existingItem.quantity = parseInt(existingItem.quantity) + parseInt(item.quantity);
				// Perform an update on the existing item
				$http.put(`/rest/sizeManager/${existingItem.id}`, existingItem)
					.then(function(resp) {
						alert("Quantity updated successfully!");
					})
					.catch(function(error) {
						alert("Error updating quantity!");
						console.log("Error", error);
					});
			} else {
				// If no matching item is found, create a new item
				$http.post(`/rest/sizeManager`, item)
					.then(function(resp) {
						$scope.items.push(resp.data);
						$scope.reset();
						alert("New size added successfully!");
					})
					.catch(function(error) {
						alert("Error adding new size!");
						console.log("Error", error);
					});
			}
		}
	};



	$scope.edit = function(item) {
		$scope.form = angular.copy(item);

		$(".nav-tabs a:eq(0)").tab("show");
	}

	$scope.reset = function() {
		$scope.form = {
			available: true,
		}
	}


	$scope.update = function() {
		if (validateForm()) {
			var item = angular.copy($scope.form);

			// Kiểm tra nếu một mục với cùng productid và size đã tồn tại trong $scope.items



			// Thực hiện cập nhật trên mục đã tồn tại
			$http.put(`/rest/sizeManager/${item.id}`, item).then(resp => {
				var index = $scope.items.findIndex(p => p.id == item.id);
				$scope.items[index] = item;
				alert("Cập nhật size thành công!");
			}).catch(function(error) {
				alert("Lỗi cập nhật size!");
				console.log("Lỗi", error);
			});

		}
	}


	$scope.delete = function(item) {
		if (confirm("Bạn muốn xóa size này?")) {
			$http.delete(`/rest/sizeManager/${item.id}`).then(resp => {
				var index = $scope.items.findIndex(p => p.id == item.id);
				$scope.items.splice(index, 1);
				$scope.reset();
				alert("Xóa size thành công!");
			}).catch(error => {
				alert("Lỗi xóa size!");
				console.log("Error", error);
			})
		}
	}
	$scope.pager = {
		page: 0,
		size: 4,
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
	$scope.initialize();
});