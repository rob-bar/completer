// This script will (eventually) apply each comp and then export to a PDF Presentation with overlays of font information
// Written by David Klawitter

#target photoshop

main();

function findTextLayers(doc, foundLayers) 
{
  var layersCount = doc.layers.length;
  for (var layersIndex = 0; layersIndex < layersCount; layersIndex++) {
    var layerRef = doc.layers[layersIndex];

    if (layerRef.typename == "ArtLayer") {
      if (layerRef.visible && layerRef.kind == "LayerKind.TEXT") {
        var text = layerRef.textItem;
        foundLayers.push(layerRef);
        //foundLayers.push(Math.round(text.size) + userFriendly(app.preferences.typeUnits) + ", " + text.font + ", #" + text.color.nearestWebColor.hexValue);
      }
    } else if (layerRef.typename == "LayerSet") {
      if (layerRef.visible) {
        findTextLayers(layerRef, foundLayers);
      }
    }
  }
}

///////////////////////////////////////////////////////////////////////////
// Function: userFriendly
// Usage: Converts constants to user-friendly copy
// Input: string
// Return: a string
///////////////////////////////////////////////////////////////////////////
function userFriendly(obj) 
{
  if (obj == "TypeUnits.PIXELS")
    return "px";
  else if (obj == "TypeUnits.POINTS") {
    return "pt";
  } else {
    return obj;
  }
}

function main()
{
  var layerCompsCount = app.activeDocument.layerComps.length;
  for (layerCompsIndex = 0; layerCompsIndex < layerCompsCount; layerCompsIndex++) {
    var textLayers = new Array();
    var layerCompRef = activeDocument.layerComps[layerCompsIndex];

    layerCompRef.apply();

    // Collect text layers for comp
    findTextLayers(app.activeDocument, textLayers);
    
    alert(textLayers);
  }  
}