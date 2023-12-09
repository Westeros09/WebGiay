app.controller("history-ctrl", function($scope, $http,$window,$timeout) {
	$scope.selectedDate = "";
	$scope.filteredItems = [];
	$scope.uniqueDates = [];
	$scope.items = [];
	$scope.form = {};
	$scope.showDetail = false;
	$scope.currentPage = 0;
    $scope.itemsPerPage = 5;
    //notification
    $scope.showNotification = false;
    $scope.notificationCount = 0;
    $scope.triggerNotification = function(message){
		$scope.showNotification = true;
		$scope.notificationCount++;
		$scope.notificationList.unshift({
			message : message,
			timestamp: new Date().toLocaleDateString('en-GB')
		});
		onclick = function(){
			$scope.hideNotification();
		}
	};
	$scope.hideNotification = function(){
		$scope.showNotification = false;
	};
	$scope.notificationList = [];
    // Update filteredItems based on pagination
    $scope.paginate = function () {
        var begin = $scope.currentPage * $scope.itemsPerPage;
        var end = begin + $scope.itemsPerPage;
        if(Array.isArray($scope.filteredItems)){
			$scope.pagedItems = $scope.filteredItems.slice(begin, end);
		}else{
			console.error('$scope.filteredItems is not an array:', $scope.filteredItems)
		}
		
    };
    // Watch for changes in filteredItems and update pagination
    $scope.$watch('filteredItems', function (newValue, oldValue) {
		if (newValue !== oldValue) {
	$scope.pager.page = $scope.currentPage;
    $scope.pager.count = Math.ceil($scope.filteredItems.length/$scope.itemsPerPage);
    $scope.paginate();
  }
    });

    // Initialize pagination
    $scope.paginate();

    // Custom pagination functions
    $scope.pager = {
		
        first: function () {
            $scope.currentPage = 0;
            $scope.paginate();

        },
        prev: function () {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
                $scope.paginate();

            }
        },
        next: function () {
            if ($scope.currentPage < this.count - 1) {
                $scope.currentPage++;
                $scope.paginate();

            }
        },
        last: function () {
            $scope.currentPage = this.count - 1;
            $scope.paginate();
    
        },
    };
   $scope.filterBySearch = function () {
        if (!$scope.searchText) {
            // If search text is empty, show all items
            $scope.filteredItems = $scope.items;
        } else {
            // Filter items based on search criteria
            $scope.filteredItems = $scope.items
                .filter(item =>
                    String(item.id).toLowerCase().includes($scope.searchText.toLowerCase()) ||
                    (item.account && String(item.account.username).toLowerCase().includes($scope.searchText.toLowerCase()))
                );
        }
        $scope.currentPage = 0;
    };
    // ...
    $scope.refreshPage = function(){
		$window.location.reload();
	}

	// Tính toán mảng uniqueDates từ items
//	function computeUniqueDates() {
//		var uniqueSet = new Set();
//$scope.items.forEach(function(item) {
//			var date = new Date(item.createDate).toLocaleDateString();
//			uniqueSet.add(date);
//		});
//		$scope.uniqueDates = Array.from(uniqueSet);
//	}

	// Thêm hàm filterByDate
	$scope.filterByDate = function(selectedDate) {
		if (selectedDate) {
			$scope.filteredItems = $scope.items.filter(function(item) {

				var itemDate = new Date(item.createDate).toLocaleDateString();

				var itemDate = new Date(item.createDate).toLocaleDateString('en-GB');
				

				return itemDate === selectedDate;
			});
		} else {
			$scope.filteredItems = $scope.items;
		}
	};

	$scope.items = [];
	$scope.form = {};
	$scope.showDetail = false;



	$scope.computeUniqueDatesAndInitDate = function() {
		flatpickr("#calendar", {
			dateFormat: "d-m-Y",
			defaultDate: $scope.selectedDate,
			onChange: function(selectedDate) {
				$timeout(function() {
					$scope.selectedDate = new Date(selectedDate).toLocaleDateString('en-GB');
					$scope.filterByDate($scope.selectedDate);
                    $scope.currentPage = 0;
				});
			}
		});
	};


	$scope.getDetailData = function(item) {
		if (item.showDetail) {
			item.showDetail = false;
		}
		else {
			$http.get(`/rest/historys/details/${item.id}`)
				.then(function(resp) {
					item.detailData = resp.data;
					item.showDetail = true;
				}).catch(function(error) {
					console.error("error: ", error)
				})
		}
	}

	$scope.initialize = function() {
		$http.get("/rest/historys").then(resp => {
			$scope.items = resp.data;
			$scope.computeUniqueDatesAndInitDate(); // tính toán mảng uniqueDates
			$scope.filterByDate($scope.selectedDate);
			$scope.triggerNotification("We have a new order");
			$scope.form = {
				
			};
		})
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
		$(".nav-tabs a:eq(0)").tab("show");
	}

	$scope.reset = function() {
		$scope.form = {
			
		}
	}

	$scope.update = function() {
		var item = angular.copy($scope.form);
		$http.put(`/rest/historys/${item.id}`, item).then(resp => {
			var index = $scope.items.findIndex(p => p.id == item.id);
			if(index.status == 'Đã Giao'){
				index.available == true;
			}
			$scope.items[index] = item;
			alert("Cập nhật lịch sử đơn hàng thành công!");
			$scope.initialize();
		})
			.catch(error => {
				alert("Lỗi cập nhật lịch sử đơn hàng!");
				console.log("Error", error);
			});
	}

	$scope.delete = function(item) {
		if (confirm("Bạn muốn xóa lịch sử đơn hàng này?")) {
			// Check if 'status' property exists in the item object
			if (!item.hasOwnProperty('status')) {
				item.status = "Đã Hủy";
			} else {
				// Update order status to "Đã Hủy" and set available to false
				item.status = "Đã Hủy";
				item.available = false;
			}

			$http.put(`/rest/historys/${item.id}`, item).then(resp => {
				console.log("Update successful:", resp.data);
				alert("Xóa lịch sử đơn hàng thành công!");
				$scope.initialize();
			}).catch(error => {
				console.error("Update error:", error);
				alert("Lỗi xóa lịch sử đơn hàng!");
			});
		}
	}


	$scope.initialize();
});