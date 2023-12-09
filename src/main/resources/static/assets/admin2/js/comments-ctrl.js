
// app.controller.js
app.controller("comments-ctrl", function($scope, $http, $window) {
	$scope.comments = [];
	$scope.commentForm = {};
	$scope.products = [];
	$scope.accounts = [];


	$scope.showReplies = function(comment) {
		if (comment.showReplies) {
			comment.showReplies = false;
		} else {
			$http.get(`/rest/comments/details/${comment.id}`)
				.then(function(resp) {
					comment.replies = resp.data;
					comment.showReplies = true;
				})
				.catch(function(error) {
					console.error("Lỗi: ", error);
				});
		}
	};
	$scope.deleteReply = function(reply) {
		if (reply && reply.id !== undefined && reply.id !== null) {
			if (confirm("Bạn có chắc muốn xóa trả lời này?")) {
				$http.delete("/rest/replies/" + reply.id)
					.then(function(resp) {
						var commentIndex = $scope.comments.findIndex(c => c.id === reply.comment.id);
						var replyIndex = $scope.comments[commentIndex].replies.findIndex(r => r.id === reply.id);

						$scope.comments[commentIndex].replies.splice(replyIndex, 1);
						alert("Xóa trả lời thành công!");
						$window.location.reload();
					})
					.catch(function(error) {
						alert("Lỗi xóa trả lời!");
						console.log("Error", error);
					});
			}
		} else {
			// Xử lý trường hợp giá trị là 'undefined' hoặc 'null'
			console.error("Dữ liệu trả lời không hợp lệ.");
		}
	}

	$scope.initialize = function() {
		// Fetch comments, products, and accounts
		$http.get("/rest/comments").then(resp => {
			$scope.comments = resp.data;
		});

		$http.get("/rest/products").then(resp => {
			$scope.products = resp.data;
		});

		$http.get("/rest/accounts").then(resp => {
			$scope.accounts = resp.data;
		});

		$scope.resetForm();
	}
	$scope.deleteComment = function(comment) {
		if (confirm("Bạn có chắc muốn xóa bình luận này?")) {
			$scope.resetPager = function() {
				// Reset pager to the first page after updating comments
				$scope.pager.first();
			};
			// Now delete the comment
			$http.delete("/rest/comments/" + comment.id)
				.then(resp => {
					var index = $scope.pager.items.findIndex(c => c.id === comment.id);
					$scope.pager.items.splice(index, 1);
					$scope.resetForm();
					alert("Xóa bình luận thành công!");
					$scope.initialize();

				})
				.catch(error => {
					alert("Lỗi xóa bình luận!");
					console.log("Error deleting comment", error);
				});
		}
	}

	$scope.validateCommentForm = function() {
		if (!$scope.commentForm.description) {
			alert("Vui lòng nhập mô tả!");
			return false;
		}

		if (!$scope.commentForm.create_Date) {
			alert("Vui lòng chọn ngày bắt đầu!");
			return false;
		}

		if (!$scope.commentForm.product || !$scope.commentForm.product.id) {
			alert("Vui lòng chọn Product Id!");
			return false;
		}

		if (!$scope.commentForm.account || !$scope.commentForm.account.username) {
			alert("Vui lòng chọn Account!");
			return false;
		}

		// Thêm các điều kiện kiểm tra khác nếu cần

		return true;
	};


	$scope.createComment = function() {
		var newComment = angular.copy($scope.commentForm);

		if ($scope.validateCommentForm()) {
			$http.post("/rest/comments", newComment).then(resp => {
				$scope.comments.push(resp.data);
				$scope.resetForm();
				alert("Thêm mới bình luận thành công!");
			}).catch(error => {
				alert("Lỗi thêm mới bình luận!");
				console.log("Error", error);
			});

		}


	}


	$scope.editComment = function(comment) {
		$scope.commentForm = angular.copy(comment);
		$scope.commentForm.create_Date = new Date(comment.create_Date);


	};

	$scope.updateComment = function() {
		var updatedComment = angular.copy($scope.commentForm);

		// Kiểm tra logic điều kiện (nếu cần)
		// ...

		$http.put("/rest/comments/" + updatedComment.id, updatedComment).then(resp => {
			var index = $scope.comments.findIndex(c => c.id === updatedComment.id);
			$scope.comments[index] = updatedComment;
			alert("Cập nhật bình luận thành công!");
		}).catch(error => {
			alert("Lỗi cập nhật bình luận!");
			console.log("Error", error);
		});
	}


	$scope.resetForm = function() {
		$scope.commentForm = {};
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
			return $scope.comments.slice(start, start + this.size);
		},
		get count() {
			return Math.ceil(1.0 * $scope.comments.length / this.size);
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