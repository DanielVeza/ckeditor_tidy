(function ($, Drupal) {
  Drupal.behaviors.PastePlainText = {
    attach: function (context, settings) {
      $(document).ready(function() {
        if (typeof(CKEDITOR) !== 'undefined') {
          CKEDITOR.instances['edit-body-0-value'].on('afterPasteFromWord', function (evt) {
            var filter = evt.editor.filter.clone();
            var fragment = CKEDITOR.htmlParser.fragment.fromHtml(evt.data.dataValue);
            var writer = new CKEDITOR.htmlParser.basicWriter();
            filter.disallow('*[*]');
            filter.disallow('*(*)');
            filter.disallow('*{*}');
            filter.disallow('span');
            // Process, and overwrite evt.data.dataValue.
            filter.applyTo(fragment);
            fragment.writeHtml(writer);
            evt.data.dataValue = writer.getHtml();
          });
          CKEDITOR.instances['edit-body-0-value'].on('paste', function (evt) {
              var filter = evt.editor.filter.clone();
              filter.disallow('span');
              filter.disallow('*[dir]');
              evt.data.dataValue = formatting(evt.data.dataTransfer._.data['text/html']);
              var fragment = CKEDITOR.htmlParser.fragment.fromHtml(evt.data.dataValue);
              var writer = new CKEDITOR.htmlParser.basicWriter();
              filter.applyTo(fragment);
              fragment.writeHtml(writer);
              evt.data.dataValue = writer.getHtml();
          });
        }
      function recursiveFormatting(context) {
        for(var index = 0; index < context.childNodes.length; index++){
          var clonedEle, ele;
          //for italicity
          if (context.childNodes[index].style.fontStyle !== "") {
            if (context.childNodes[index].style.fontStyle === "italic") {
              context.childNodes[index].style.fontStyle = null;
              clonedEle = context.childNodes[index].cloneNode(true);
              ele = document.createElement("em");
              ele.append(clonedEle);
              context.replaceChild(ele, context.childNodes[index]);
            } else {
              context.childNodes[index].style.fontStyle = null;
            }
          }
          //for underline
          if (context.childNodes[index].style.textDecoration !== "") {
            if (context.childNodes[index].style.textDecoration === "underline") {
              context.childNodes[index].style.textDecoration = null;
              clonedEle = context.childNodes[index].cloneNode(true);
              ele = document.createElement("u");
              ele.append(clonedEle);
              context.replaceChild(ele, context.childNodes[index]);
            } else {
              context.childNodes[index].style.textDecoration = null;
            }
          }
          //for bold
          if (context.childNodes[index].style.fontWeight !== "") {
            if (context.childNodes[index].style.fontWeight > "400") {
              context.childNodes[index].style.fontWeight = null;
              clonedEle = context.childNodes[index].cloneNode(true);
              ele = document.createElement("strong");
              ele.append(clonedEle);
              context.replaceChild(ele, context.childNodes[index]);
            } else {
              context.childNodes[index].style.fontWeight = null;
            }
          }
          if (context.childNodes[index].children.length > 0) {
            recursiveFormatting(context.childNodes[index]);
          }
        }
      }

      function formatting(str) {
        var parent = document.createElement("div");
        var parentCopy = document.createElement("div");
        parentCopy.innerHTML = str;
        var len = parentCopy.childNodes[0].children.length;
        if (len === 0){
          return parentCopy.innerHTML;
        }
        for(var i = 0; i<len; i++ ) {
          parent.appendChild(parentCopy.childNodes[0].children[i].cloneNode(true));
        }
        recursiveFormatting (parent);
        return parent.innerHTML;
      }
      })
    }
  }
})(jQuery, Drupal);
