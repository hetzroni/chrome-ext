chrome.extension.sendMessage({}, function(response) {
	initialIjection();
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

			loadedInjection();

		}
	}, 10);
});

function daysInMonth(month, year) {
return 32 - new Date(year, month, 32).getDate();
}

function isWeekday(year, month, day) {
var day = new Date(year, month, day).getDay();
return day !=5 && day !=6;
}

function getWeekdaysInMonth(month, year) {
var days = daysInMonth(month, year);
var weekdays = 0;
var today = new Date();
var dayOfMonth = today.getDate();
for(var i=dayOfMonth; i< days+1; i++) {
    if (isWeekday(year, month, i+1)) weekdays++;
}
return weekdays;
}


function initialIjection() {
	var today = new Date();
	var year = today.getFullYear()
	var month = today.getMonth()
    var daysLeft = getWeekdaysInMonth(month, year)
	var alreadyOrderedToday = Array.prototype.some.call(
		document.querySelectorAll(".reportDataTr .reportDataTd:nth-of-type(2)"),
		function(val) {
			[date, month, year] = val.innerText.split('/');
			return new Date(year, month-1, date).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);
		}
	);
	if (alreadyOrderedToday) {
		daysLeft--;
	}

	var remainder = /[\d\.]+/.exec(document.querySelector(".userReportDataTbl .currency:nth-child(6)").innerText) - /[\d\.]+/.exec(document.querySelector(".userReportDataTbl .currency:nth-child(4)").innerText);
	var dailyRemainder = remainder / daysLeft;
	document.querySelector(".userReportDataTbl tr:last-child").insertAdjacentHTML('beforebegin', `
		<tr>
			<th class="totalsFieldNameTh">
				מספר ימים :
			</th>
			<th class="totalsFieldValueTh currency">
				<input id="daysLeft" size="4" value="${daysLeft}">
			</th>
			<th class="totalsFieldNameTh">
				יתרה יומית :
			</th>
			<th class="totalsFieldValueTh currency" id="dailyRemainder">
				₪${dailyRemainder.toFixed(2)}
			</th>
			<th class="totalsFieldNameTh">
				יתרה חודשית :
			</th>
			<th class="totalsFieldValueTh currency">
				₪${remainder.toFixed(2)}
			</th>
		</tr>
	`);
	document.querySelector("#daysLeft").addEventListener('input', function() {
		document.querySelector("#dailyRemainder").innerText = (remainder / this.value).toFixed(2);
	});
}

function loadedInjection() {
}

