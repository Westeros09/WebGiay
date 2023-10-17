const app = angular.module("app1", ["ngRoute"]);

app.config(function($routeProvider) {
	$routeProvider
		.when("/dashboard", {
			templateUrl: "/assets/admin2/pages/dashboard/index.html",
			controller: "dashboard-ctrl"
		})
		.when("/table", {
			templateUrl: "/assets/admin2/pages/tables.html",
			
		})
		.when("/billing", {
			templateUrl: "/assets/admin2/pages/billing.html",
			
		})

		.when("/history", {
			templateUrl: "/assets/admin2/pages/history.html",
			controller: "history-ctrl"
		.when("/discount", {
			templateUrl: "/assets/admin2/pages/discountCode/index.html",
			controller: "discount-ctrl"
		}).when("/discountProduct", {
			templateUrl: "/assets/admin2/pages/discountProduct/index.html",
			controller: "discountProduct-ctrl"
		}).when("/size", {
			templateUrl: "/assets/admin2/pages/size/index.html",
			controller: "size-ctrl"

		})
		.otherwise({
			redirectTo: "/dashboard"

		});
});