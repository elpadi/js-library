Object.defineProperty(HTMLElement.prototype, 'enableDragEvents', {
	value: function() {
		this.addEventListener('mousedown', DragEventHandlers.onMouseDown);
		this.addEventListener('mouseup', DragEventHandlers.onMouseUp);
	}
});

var DragEventHandlers = (function() {
	
	var element;

	var parsePosition = function(e) {
		return { x: e.clientX, y: e.clientY };
	};

	var dispatchDragEvent = function(e, type) {
		var pos = parsePosition(e), delta, total, dragEvent, count;
		if (type === 'start') {
			element.dragStartPos = pos;
			element.dragMoveCount = -1;
			element.dragPrev = pos;
		}
		delta = { x: pos.x - element.dragPrev.x, y: pos.y - element.dragPrev.y };
		total = { x: pos.x - element.dragStartPos.x, y: pos.y - element.dragStartPos.y };
		element.dragMoveCount += 1;
		element.dragPrev = pos;
		dragEvent = new CustomEvent('drag' + type, {
			detail: {
				start: element.dragStartPos,
				change: delta,
				total: total,
				count: element.dragMoveCount
			}
		});
		element.dragging = type === 'move';
		element.dispatchEvent(dragEvent);
	};

	var dragMove = function(e) {
		dispatchDragEvent(e, 'move');
	};

	return {
		onMouseDown: function(e) {
			var button = 'which' in e ? e.which : ('button' in e ? e.button : NaN);
			if (button < 2) {
				element = e.target;
				dispatchDragEvent(e, 'start');
				window.addEventListener('mousemove', dragMove);
			}
		},
		onMouseUp: function(e) {
			window.removeEventListener('mousemove', dragMove);
			if (e.target.dragging) {
				dispatchDragEvent(e, 'end');
			}
		}
	};

})();

