app.controller("account-ctrl", function($scope, $http) {
	$scope.items = [];
	$scope.form = {};

	$scope.initialize = function() {
		$http.get("/rest/accounts").then(resp => {
			$scope.items = resp.data;
			$scope.form = {

			};


			$scope.reset();
			$scope.loadCurrentUser();
		});

	};
$scope.encryptPassword = function(password) {
    const encryptedPassword = '*'.repeat(10);
    return encryptedPassword;
};
	$scope.reset = function() {
		$scope.form = {
			photo: "cloud-upload.jpg"
		}
	}
	$scope.sendEmail = function() {
		if ($scope.form && $scope.form.email) {
			var email = $scope.form.email;
			var emailJSON = { email: email };
			$http.post("/rest/accounts/sendEmail", emailJSON).then(resp => {
				$scope.reset();
				alert("Mật khẩu mới đã được gửi đến địa chỉ email của bạn.");

			}).catch(error => {
				$scope.reset();
				alert("Mật khẩu mới đã được gửi đến địa chỉ email của bạn.");
				console.log("Error", error);
			});
		} else {
			alert("Không tìm thấy địa chỉ email.");
		}
	};



	$scope.loadCurrentUser = function() {
		$http.get("/rest/accounts/current-account").then(resp => {
			$scope.account = resp.data;
		});
	};

	$scope.imageChanged = function(files) {
		var data = new FormData();
		data.append('file', files[0]);
		$http.post('/rest/upload/images', data, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(resp => {
			$scope.form.photo = resp.data.name;
		}).catch(error => {
			alert("Lỗi upload hình ảnh");
			console.log("Error", error);
		});
	}


	$scope.edit = function(item) {
		$scope.form = angular.copy(item);

	}
	$scope.deleteSaveData = function(item) {
		item.available = false;
		console.log(item);
		if (confirm("Bạn có muốn vô hiệu hóa tài khoản này không ?")) {
			$http.put(`/rest/accounts/${item.username}`, item).then(response => {
				alert("Vô hiệu hóa tài khoản thành công !");
				$scope.reset();
				$scope.initialize();
			}).catch(error => {
				alert("Lỗi vô hiệu hóa tài khoản !");
				console.log("Error", error);
			});
		}
	};
	

$scope.update = function() {
    var item = angular.copy($scope.form);
    $http.put(`/rest/accounts/${item.username}`, item)
        .then(resp => {
            var index = $scope.items.findIndex(p => p.id == item.id);
            $scope.items[index] = item;
            $http.get("/rest/accounts").then(resp => {
                $scope.items = resp.data;
            });


            alert("Cập nhật tài khoản thành công!");
        })
        .catch(error => {
            if (error.status === 409) {
                alert("Vui lòng chọn địa chỉ email khác. Địa chỉ email đã tồn tại!");
            } else {
                alert("Lỗi cập nhật tài khoản.");
                console.log("Error", error);
            }
        });
};






$scope.generateRandomPassword = function() {
    const randomPassword = Math.random().toString(36).slice(8);
    $scope.form.password = randomPassword;
};


      
    
	$scope.create = function() {
    var item = angular.copy($scope.form);
    $http.post(`/rest/accounts`, item)
        .then(resp => {
			$http.get("/rest/accounts").then(resp => {
                $scope.items = resp.data;
            });
            alert("Thêm mới tài khoản thành công!");
        })
        .catch(error => {
            if (error.status === 409) {
                alert("Địa chỉ email đã tồn tại. Vui lòng chọn địa chỉ email khác.");
            } else {
                alert("Lỗi thêm mới tài khoản!");
                console.log("Error", error);
            }
        });
};





	$scope.delete = function(item) {
    if (confirm("Bạn muốn xóa người dùng này?")) {
        $http.delete(`/rest/accounts/${item.username}`).then(resp => {
            var index = $scope.items.findIndex(p => p.id == item.id);
            $scope.items.splice(index, 1);
            $http.get("/rest/accounts").then(resp => {
                $scope.items = resp.data;
            });
            $scope.reset();
            alert("Xóa người dùng thành công!");
        }).catch(error => {
            if (error.data) {
                alert("Xóa thất bại. Người dùng đang có đơn hàng.");
            } else {
                alert("Xóa người dùng thành công!");
            }
            console.log("Error", error);
        }).finally(()=>{
			$http.get("/rest/accounts").then(resp => {
                $scope.items = resp.data;
		});
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
            return $scope.items.slice(start, start + this.size);
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
    };


	$scope.initialize();

});
