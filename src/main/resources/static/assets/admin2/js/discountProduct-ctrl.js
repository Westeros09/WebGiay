app.controller("discountProduct-ctrl", function($scope, $http) {
	$scope.items = [];
	$scope.form = {};
	$scope.startDate = "";
	$scope.endDate = "";

	$scope.initialize = function() {
		$http.get("/rest/products").then(resp => {
			$scope.products = resp.data;
		});

		$http.get("/rest/discountProduct").then(resp => {
			$scope.items = resp.data;
		});
		$scope.reset(); // đặt lại form để có hình mẫu mới đầu
		$scope.loadCurrentUser();
	}



	// Other functions and initialization code as needed


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

		if (!$scope.form.name) {
			alert("Vui lòng nhập Discount Name!");
			return false;
		}

		// Kiểm tra xem ngày bắt đầu có được chọn hay không
		if (!$scope.form.start_Date) {
			alert("Vui lòng chọn Ngày bắt đầu!");
			return false;
		}

		// Kiểm tra xem ngày kết thúc có được chọn hay không
		if (!$scope.form.end_Date) {
			alert("Vui lòng chọn Ngày kết thúc!");
			return false;
		}

		if ($scope.form.start_Date > $scope.form.end_Date) {
			alert("Ngày bắt đầu phải nhỏ hơn ngày kết thúc!");
			return false;
		}

		// Kiểm tra xem Percentage có phải là số không
		if (!/^\d+$/.test($scope.form.percentage)) {
			alert("Vui lòng nhập Percentage là số!");
			return false;
		}

		// Chuyển đổi Percentage thành số và kiểm tra nó
		const percentage = parseInt($scope.form.percentage, 10);
		if (isNaN(percentage) || percentage < 0 || percentage > 100) {
			alert("Vui lòng nhập Percentage hợp lệ (từ 0 đến 100)!");
			return false;
		}

		if (!$scope.form.percentage || $scope.form.percentage < 0 || $scope.form.percentage > 100) {
			alert("Vui lòng nhập Percentage hợp lệ!");
			return false;
		}

		if ($scope.form.active !== true && $scope.form.active !== false) {
			alert("Vui lòng chọn trạng thái Active!");
			return false;
		}



		return true;
	}
function hasOverlappingPeriod(item) {
    // Duyệt qua danh sách các sản phẩm đã có
    for (var i = 0; i < $scope.items.length; i++) {
        var existingItem = $scope.items[i];

        // Kiểm tra xem sản phẩm có cùng ID không và không phải là chính nó (nếu là update)
        if (existingItem.product.id === item.product.id && existingItem !== item) {
            // Chuyển đổi ngày bắt đầu và ngày kết thúc thành đối tượng Date
            var existingStartDate = new Date(existingItem.start_Date);
            var existingEndDate = new Date(existingItem.end_Date);
            var newItemStartDate = new Date(item.start_Date);
            var newItemEndDate = new Date(item.end_Date);

            // Kiểm tra xem có sự trùng lặp trong khoảng thời gian không
            if (
                (newItemStartDate < existingEndDate && newItemEndDate > existingStartDate) ||
                (existingStartDate < newItemEndDate && existingEndDate > newItemStartDate)
            ) {
                console.log("Conflict detected:", existingItem.id, item.id);
                return true; // Có sự trùng lặp, không cho phép thêm mới sản phẩm
            }
        }
    }
    return false; // Không có sự trùng lặp
}



	$scope.create = function() {
		if (validateForm()) {

			var item = angular.copy($scope.form);

			// Check for duplicate products and overlapping time periods
			if (hasOverlappingPeriod(item)) {
				alert("Sản phẩm giảm giá của bạn đã trùng thời gian với sản phẩm khác!");
				return;
			}

			$http.post(`/rest/discountProduct`, item).then(resp => {
				$scope.items.push(resp.data);
				$scope.reset();
				alert("Thêm mới mã giảm giá thành công!");
			}).catch(error => {
				alert("Lỗi thêm mới mã giảm giá!");
				console.log("Error", error);
			});
		}
	}


	$scope.edit = function(item) {
		$scope.form = angular.copy(item);
		$scope.form.start_Date = new Date(item.start_Date);
		$scope.form.end_Date = new Date(item.end_Date);
		/*	$(".nav-tabs a:eq(0)").tab("show");*/
	}

	$scope.reset = function() {
		$scope.form = {
			available: true,
		}
	}
	
	
	
	
	function hasOverlappingPeriodForUpdate(item) {
    // Chuyển đổi ngày bắt đầu và ngày kết thúc thành đối tượng Date
    var newItemStartDate = new Date(item.start_Date);
    var newItemEndDate = new Date(item.end_Date);

    // Duyệt qua danh sách các sản phẩm đã có
    for (var i = 0; i < $scope.items.length; i++) {
        var existingItem = $scope.items[i];

        // Kiểm tra xem sản phẩm có cùng ID không và không phải là chính nó (nếu là update)
        if (existingItem.product.id === item.product.id && existingItem.id !== item.id) {
            var existingStartDate = new Date(existingItem.start_Date);
            var existingEndDate = new Date(existingItem.end_Date);

            // Kiểm tra xem có sự trùng lặp trong khoảng thời gian không
            if (
                (newItemStartDate <= existingEndDate && newItemEndDate >= existingStartDate) ||
                (existingStartDate <= newItemEndDate && existingEndDate >= newItemStartDate)
            
            
            ) 
  console.log("Conflict detected:", existingItem.id, item.id);            
             {
                console.log("Conflict detected:", existingItem.id, item.id);
                return true; // Có sự trùng lặp, không cho phép thêm mới sản phẩm
            }
        }
    }
    return false; // Không có sự trùng lặp
}



	$scope.update = function() {
		if (validateForm()) {

			var item = angular.copy($scope.form);

			
			console.log(item.product.id)
			console.log(item.id)
// Check for duplicate products and overlapping time periods
			if (hasOverlappingPeriodForUpdate(item)) {
				alert("Sản phẩm giảm giá của bạn đã trùng thời gian với sản phẩm khác!");
				return;
			}
			$http.put(`/rest/discountProduct/${item.id}`, item).then(resp => {
				// Update the existing item in the items array
				var index = $scope.items.findIndex(p => p.id == item.id);
				console.log(item.id)

				if (index !== -1) {
					$scope.items[index] = angular.copy(item);
					alert("Cập nhật mã giảm giá thành công!");
				} else {
					alert("Không tìm thấy sản phẩm để cập nhật!");
				}
			}).catch(error => {
				alert("Lỗi cập nhật mã giảm giá sản phẩm đơn hàng!");
				console.log("Error", error);
			});
		}
}
/*
		$scope.update = function() {
			var item = angular.copy($scope.form);

			



			$http.put(`/rest/discountProduct/${item.id}`, item).then(resp => {
				// Update the existing item in the items array
				var index = $scope.items.findIndex(p => p.id == item.id);

				if (index !== -1) {
					$scope.items[index] = angular.copy(item);
					alert("Cập nhật mã giảm giá thành công!");
				} else {
					alert("Không tìm thấy sản phẩm để cập nhật!");
				}
			}).catch(error => {
				alert("Lỗi cập nhật mã giảm giá sản phẩm đơn hàng!");
				console.log("Error", error);
			});
		}
*/


		$scope.delete = function(item) {
			if (confirm("Bạn muốn xóa lịch sử đơn hàng này?")) {
				$http.delete(`/rest/discountProduct/${item.id}`).then(resp => {
					var index = $scope.items.findIndex(p => p.id == item.id);
					$scope.items.splice(index, 1);
					$scope.reset();
					alert("Xóa lịch sử đơn hàng thành công!");
				}).catch(error => {
					alert("Lỗi xóa lịch sử đơn hàng!");
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
