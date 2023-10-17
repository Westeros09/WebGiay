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
	}
	$scope.create = function() {
		var item = angular.copy($scope.form);

		// Kiểm tra nếu một mục với cùng productid và size đã tồn tại trong $scope.items
		var existingItem = $scope.items.find(function(existing) {
			return existing.productid === item.productid && existing.size === item.size;
		});

		if (existingItem) {
			// Nếu đã tồn tại một mục với cùng productid và size, tăng thêm quantity
			existingItem.quantity = parseInt(existingItem.quantity) + parseInt(item.quantity);;

			// Thực hiện cập nhật trên mục đã tồn tại
			$http.put(`/rest/sizeManager/${existingItem.id}`, existingItem).then(function(resp) {
				alert("Thêm số lượng thành công!");
			}).catch(function(error) {
				alert("Lỗi thêm số lượng!");
				console.log("Lỗi", error);
			});
		} else {
			// Nếu không tìm thấy mục phù hợp, tạo một mục mới
			$http.post(`/rest/sizeManager`, item).then(function(resp) {
				$scope.items.push(resp.data);
				$scope.reset();
				alert("Thêm mới size thành công!");
			}).catch(function(error) {
				alert("Lỗi thêm mới size!");
				console.log("Lỗi", error);
			});
		}
	}









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