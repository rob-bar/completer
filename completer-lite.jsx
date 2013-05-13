// This script will search your layers for font information and pop up a complete list of fonts used
// Written by David Klawitter

#target photoshop

main();

///////////////////////////////////////////////////////////////////////////
// Function: userFriendly
// Usage: Converts constants to user-friendly copy
// Input: string
// Return: a string
///////////////////////////////////////////////////////////////////////////
function userFriendly(obj) {
  if (obj == "TypeUnits.PIXELS") {
    return "px";
  } else if (obj == "TypeUnits.POINTS") {
    return "pt";
  } else {
    return obj;
  }
}

function findTextLayers(doc, foundLayers) {
  var layersCount = doc.layers.length;

  for (var layersIndex = 0; layersIndex < layersCount; layersIndex++) {
    var layerRef = doc.layers[layersIndex];

    if (layerRef.typename == "ArtLayer") {
      if (layerRef.visible && layerRef.kind == "LayerKind.TEXT") {
        var text = layerRef.textItem;
        var hex = "";
        try {
          if (text.hasOwnProperty('color') && text["color"] !== undefined)
            hex = ', #' + text.color.rgb.hexValue;
        } catch(e){}

        var str = text.font +", "+ text.size + hex;
        if(!arrayContains(foundLayers, str)) {
          foundLayers.push(str);
        }
      }
    } else if (layerRef.typename == "LayerSet") {
      if (layerRef.visible) {
        findTextLayers(layerRef, foundLayers);
      }
    }
  }
}

function arrayContains(a, obj) {
  var i = a.length;
  while (i--) {
    if (a[i] === obj) {
      return true;
    }
  }
  return false;
}

function main() {
  var doc = app.activeDocument;
  var textLayers = [];
  findTextLayers(doc, textLayers);
  var sorted = textLayers.sort();
  sorted.splice(0, 0, "Font Usage");
  alert(sorted.join('\n'));
}