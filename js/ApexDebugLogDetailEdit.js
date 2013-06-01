;

var $logCell, $logNav, $logContent, $rawCode, $niceCode, $toggleLink;

function toggleCode(ev) {
	$rawCode.toggle();
	$niceCode.toggle();
	$toggleLink.text( $rawCode.is(':visible') ? 'view nice code' : 'view raw code');
}

function opensGroup(eventid) {
	return /^\w+_(ENTER|ENTRY|STARTED|BEGIN)/.test(eventid);
}

function closesGroup(groupid, line) {
	return /^\w+_(EXIT|FINISHED|END)/.test(line);
}

function process($container, groupid, lines, depth) {
	var line = null;

	while( (line = lines.shift()) != null ) {
		var parts     = line.split('|'),
			timestamp = parts.shift(),
			type      = parts.shift(),
			eventid   = parts.join('|');

		if ( opensGroup(type) ) {
			var $groupContainer = $('<div class="log-group-container depth-' + depth + '"/>'),
				$contentContainer = $('<div class="log-group-content"/>'),
				$idcontainer = $('<div class="log-group-opener"></div>')
					.append('<span class="log-toggle-btn">-</span>')
					.append('<pre class="codeBlock">' + line + '</pre></div>');

			$groupContainer.append($idcontainer, process($contentContainer, eventid, lines, depth+1));
			$container.append($groupContainer);

		} else {
			$container.append('<pre class="codeBlock">' + line + '</pre>');
			if ( closesGroup(groupid, type) ) break;
		}
	}

	return $container;
}

function parseNiceCode() {
	var lines = $rawCode.text().split('\n');
	var $container = $('<div id="log-container"></div>');
	return process($container, null, lines, 0);
}

$(document).ready(function(){

	$logCell    = $('td.col02.last');
	$logNav     = $('<div id="log-topnav"></div>');
	$logContent = $('<div id="log-content"></div>');
	$rawCode    = $('<div id="log-raw"></div>').append($logCell.find('pre'));
	$niceCode   = $('<div id="log-nice" class="hidden"></div>');
	$toggleLink = $('<a href="javascript:void(0)">view nice code</a>').on('click',toggleCode);

	$logCell
		.empty()
		.append(
			$logNav.append(
				$toggleLink),
			$logContent.append(
				$rawCode,
				$niceCode));

	$niceCode.append( parseNiceCode() );

	$('.log-toggle-btn').on('click', function(ev){
		ev.stopPropagation();
		$(this).parent().parent().find('>.log-group-content').toggle(200);
		$(this).text( $(this).text() == '-' ? '+' : '-' );
		return false;
	});

	$('#log-content pre').on('click', function(ev){ ev.stopPropagation(); });
});