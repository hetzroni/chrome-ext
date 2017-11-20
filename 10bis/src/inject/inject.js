chrome.extension.sendMessage({}, function(response) {
	initialIjection();
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

			loadedInjection();

		}
	}, 10);
});

function daysOfMonth(date) {
  date = new Date(date);
  date.setDate(1);
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);
  return date.getDate();
}

function initialIjection() {
	var today = new Date();
	var dayOfMonth = today.getDate();
	var dayOfWeek = today.getDay();
	var year = today.getFullYear()
	var month = today.getMonth() + 1
	var daysInMonth = new Date(year, month, 0).getDate() + 1;
	var daysLeft = daysInMonth - dayOfMonth - ~~((daysInMonth - dayOfMonth + (dayOfWeek + 1) % 7) / 7) - ~~((daysInMonth - dayOfMonth + dayOfWeek) / 7);

	var alreadyOrderedToday = Array.prototype.some.call(
		document.querySelectorAll(".reportDataTr .reportDataTd:nth-of-type(2)"),
		function(val) {
			[date, month, year] = val.innerText.split('/');
			return new Date(year, month - 1, date).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);
		}
	);
	if (alreadyOrderedToday) {
		daysLeft--;
	}

	var remainder = 1000 - /[\d\.]+/.exec(document.querySelector(".userReportDataTbl .currency:nth-child(4)").innerText);
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

