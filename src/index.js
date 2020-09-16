console.log("hello world!");

// parcel specific import
import { ShipPortraits, ShipTypeIcons } from "./imagelist.js"
// azur lane api ships as a local json
import ships from "./ships.json"

// console.log(ships[0]);
// console.log(ShipPortraits.values());
const ShipPortraitList = [];
const ShipTypeIconMap = {
  Destroyer: ShipTypeIcons.DDicon,
  Light_Cruiser: ShipTypeIcons.CLicon,
  St_Louis_subclass: ShipTypeIcons.CLicon,
  Heavy_Cruiser: ShipTypeIcons.CAicon,
  Battleship: ShipTypeIcons.BCicon,
  Light_Aircraft_Carrier: ShipTypeIcons.CVLicon,
  Aircraft_Carrier: ShipTypeIcons.CVLicon,
  Repair_Ship: ShipTypeIcons.ARicon,
  A_subclass: ShipTypeIcons.DDicon,
  B_subclass: ShipTypeIcons.DDicon,
  Southampton_subclass: ShipTypeIcons.CLicon,
  Edinburgh_subclass: ShipTypeIcons.CAicon,
  London_subclass: ShipTypeIcons.CAicon,
  Kent_subclass: ShipTypeIcons.CAicon,
  Norfolk_subclass: ShipTypeIcons.CAicon,
  Battlecruiser: ShipTypeIcons.BCicon,
  Monitor: ShipTypeIcons.BMicon,
  Ayanami_subclass: ShipTypeIcons.DDicon,
  Akatsuki_subclass: ShipTypeIcons.DDicon,
  Submarine: ShipTypeIcons.SSicon,
  Submarine_Carrier: ShipTypeIcons.SSVicon,
  Large_Cruiser: ShipTypeIcons.CBicon
}

function DoSanityCheck()
{
  for (let i in ShipTypeIconMap)
  {
    if (ShipTypeIconMap[i] == null)
    {
      throw new Error(`null type found in ShipTypeIconMap, ${i}`); 
    }
  }
}

function IS_DEBUG()
{
  return process.env.NODE_ENV === "development"
}

function DoPreProcessing()
{
    // populate images into a list for pre-processing
  for (let s in ShipPortraits)
  {
    let value = ShipPortraits[s];
    ShipPortraitList.push(value);
  }

  // console.log(ShipPortraitList);
  // for (let i of ShipPortraitList)
  // {
  //   console.log(`i: ${i}, uname: ${getUNameFromFileName(i)}`);
  // }

  // add ship images to ship json (runtime)
  for (let s of ships)
  {
    let wikiName = getUNameFromShip(s);
    // todo: this is SUPER slow
    let fname = ShipPortraitList.find(ele => getUNameFromFileName(ele) === wikiName);
    if (fname)
    {
      s['shipCardImg'] = fname
      generateShipCard(s);
    }
    else if (IS_DEBUG())
    {
      throw new Error(`Could not find match for ${wikiName} (${fname})`);
    }
    // console.log(`WikiName: ${wikiName}, fname: ${fname}`);

    // get unicode translated name
    function getUNameFromShip(ship) {
      return decodeURIComponent(new URL(ship.wikiUrl).pathname).replace('/','');
    }
    // parcel packages the filenames for us, lets get the ship name
    function getUNameFromFileName(filename) {
      return filename.match(/-(.*)Shipyard/)[1];
    }
  }
}

// Light Cruiser
//  "Destroyer" &&
//  "Heavy Cruiser" &&
//  "Battleship" &&
//  "Repair Ship" &&
//  "Battlecruiser" &&
//  "Submarine Carrier" &&
// Aircraft Carrier")

function generateShipCard(ship)
{
  // pick class color color based on rariry
  let topborder;
  let botborder;
  let bg;
  let rarity = ship.rarity.toLowerCase();
  if ('decisive' === rarity)
  {
    topborder = "ship-color-ultra"
    bg = "ship-portrait-bg-ultra"
    botborder = "ship-color-ultra-2"
  }
  else if (('super rare' === rarity)  || ('priority' === rarity))
  {
    topborder = "ship-color-ssr"
    botborder = topborder;
    bg = "ship-portrait-bg-ssr"
  }
  else if ('elite' === rarity)
  {
    topborder = "ship-color-elite"
    botborder = topborder;
    bg = "ship-portrait-bg-elite"
  }
  else if ('rare' === rarity)
  {
    topborder = "ship-color-rare"
    botborder = topborder;
    bg = "ship-portrait-bg-rare"
  }
  else if ('normal' === rarity)
  {
    topborder = "ship-color-common"
    botborder = topborder;
    bg = "ship-portrait-bg-common"
  }
  else if (IS_DEBUG) {
    throw new Error(`Unknown rarity found: ${rarity}, ${ship.names.en}`);
  }

  // build tag
  const portrait = ship.shipCardImg;
  const typeIcon = getClassTypeIcon(ship);
  // const cashTag = $(`<div id="container" class="border border-black rounded-md border-opacity-75 ml-4 mb-4"><div id="top-border" class="rounded-t-md h-2 ${topborder}"></div><div class="flex"><div class="relative border-l border-r ${topborder}" id='portrait-container'><div class="absolute top-0 bg-black bg-opacity-50 w-full"><img class="h-full select-none inline-block absolute top-0 left-0" src="${typeIcon}"><div class="text-white text-2xl font-semibold text-right leading-none pr-2 select-none level-text tracking-wider">Lv.100</div></div><img class="border-l-4 border-r-4 border-opacity-75 border-black ${bg}" width="144" height="192" src="${portrait}"><div class="absolute bottom-0 bg-black bg-opacity-75 text-white text-md tracking-wide align-bottom w-full text-center leading-none mb-3 pb-1 select-none name-text truncate px-2">${ship.names.en}</div></div></div><div id="bottom-border" class="relative rounded-b-md h-2 border ${botborder}"><div class="flex align-centers justify-center"><div id="star-container" class="absolute bottom-0 leading-none"></div></div></div></div>`);
  const cashTag = $(`<div id="container" class="border border-black rounded-md border-opacity-75 ml-4 mb-4">
    <div id="top-border" class="rounded-t-md h-2 ${topborder}"></div>
    <div class="flex">
      <div class="relative border-l border-r ${topborder}" id='portrait-container'>
        <div class="absolute top-0 bg-black bg-opacity-50 w-full">
          <img class="h-full select-none inline-block absolute top-0 left-0" src="${typeIcon}">
          <div class="text-white text-2xl font-semibold text-right leading-none pr-2 select-none level-text tracking-wider">Lv.100</div>
        </div>
        <img class="border-l-4 border-r-4 border-opacity-75 border-black ${bg}" style="width: 144px; height: 192px;" src="${portrait}">
        <div class="absolute bottom-0 bg-black bg-opacity-75 text-white text-md tracking-wide align-bottom w-full text-center leading-none mb-3 pb-1 select-none name-text truncate px-2">${ship.names.en}</div>
      </div>
    </div>
    <div id="bottom-border" class="relative rounded-b-md h-2 border ${botborder}">
      <div class="flex align-centers justify-center">
        <div id="star-container" class="absolute bottom-0 leading-none">
        </div>
      </div>
    </div>
  </div>`);
  generateStarCnt(ship, cashTag);

  // add to DOM
  $('#shipcollection')[0].append(cashTag[0]);

  // throw new Error(`HALTING FOR DEBUG.`);

  function getClassTypeIcon(ship)
  {
    const origType = ship.hullType;
    // sanitize type. spaces -> _ and remove dot(s)
    let searchType = origType.replace(/ /g,'_');
    searchType = searchType.replace(/\./g,'');
    let res = ShipTypeIconMap[searchType];
    if (null == res)
    {
      throw new Error(`null type found when searching ShipTypeIconMap, shipName: ${ship.names.en}, origType: ${origType}, searchWord: ${searchType}, res: ${res}`); 
    }
    return res;
  }

  // generate tags for each star
  function generateStarCnt(ship, shipTag)
  {
    let starTag = '<i class="relative fas fa-star text-yellow-300 stroke-2 -mr-2 text-md"><i class="absolute text-yellow-900 left-0 far fa-star"></i></i>';
    for (let i = 0; i < ship.stars.value; i++)
    {
      let cash = $(starTag);
      // this first margin left allows the group to appear more 'centered'
      if (i == 0) cash.addClass('-ml-3');
      // console.log(shipTag)
      // console.log()
      shipTag.find('#star-container')[0].append(cash[0]);
    }
  }
}

function main()
{
  if (IS_DEBUG())
  {
    DoSanityCheck();
  }
  DoPreProcessing();
  console.log('done pre processing');
}
main();

// const _DEBUG = false;
// if (_DEBUG)
// {
//   let i;
//   for (i = 0; i < 199; i++)
//   {
//     let tag=`<div id="container" class="border border-black rounded-md border-opacity-75 ml-4 mb-4 fadeIn">
//             <div id="top-border" class="rounded-t-md h-2 ship-color-elite"></div>
//             <div class="flex">
//               <div class="relative border-l border-r ship-color-elite" id='portrait-container'>
//                 <div class="absolute top-0 bg-black bg-opacity-50 w-full">
//                   <img class="h-full select-none inline-block absolute top-0 left-0" src="${clicon}">
//                   <div class="text-white text-2xl font-semibold text-right leading-none pr-2 select-none level-text tracking-wider">Lv.100</div>
//                 </div>
//                 <img class="border-l-4 border-r-4 border-opacity-75 border-black ship-portrait-bg-elite" width="144" height="192" src="${ShipPortraits.bel}">
//                 <div class="absolute bottom-0 bg-black bg-opacity-75 text-white text-md tracking-wide align-bottom w-full text-center leading-none mb-3 pb-1 select-none name-text truncate px-2">Little Bel</div>
//               </div>
//             </div>
//             <div id="bottom-border" class="relative rounded-b-md h-2 border ship-color-elite">
//               <div class="flex align-centers justify-center">
//                 <div class="absolute bottom-0 leading-none">
//                   <i class="relative fas fa-star text-yellow-300 stroke-2 -ml-3 -mr-3 text-md leading-none"><i class="absolute text-yellow-900 left-0 far fa-star"></i></i>
//                   <i class="relative fas fa-star text-yellow-300 stroke-2 -mr-3 text-md"><i class="absolute text-yellow-900 left-0 far fa-star"></i></i>
//                   <i class="relative fas fa-star text-yellow-300 stroke-2 -mr-3 text-md"><i class="absolute text-yellow-900 left-0 far fa-star"></i></i>
//                   <i class="relative fas fa-star text-yellow-300 stroke-2 -mr-3 text-md"><i class="absolute text-yellow-900 left-0 far fa-star"></i></i>
//                   <i class="relative fas fa-star text-yellow-300 stroke-2 -mr-3 text-md"><i class="absolute text-yellow-900 left-0 far fa-star"></i></i>
//                 </div>
//               </div>
//             </div>
//           </div>`
//     $('#shipcollection')[0].append($(tag)[0]);
//   }
// }
