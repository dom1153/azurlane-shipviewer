if (IS_DEBUG()) console.log("starting index.js!");
// use 'debugger' to create breakpoints

// parcel specific import
import { ShipPortraits, ShipTypeIcons } from "./imagelist.js"
// azur lane api ships as a local json
import ShipsDBList from "./ships.json"

const ShipPortraitMap = {};
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
  Large_Cruiser: ShipTypeIcons.CBicon,
}

function IS_DEBUG()
{
  return process.env.NODE_ENV === "development"
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

// parcel packages the filenames for us, lets get the ship name. also adds a _ to allow any name
function getShipMapKeyFromFileName(filename)
{
  return "_" + filename.match(/-(.*)Shipyard/)[1]
}

// get unicode translated name. _ is prepended to allow names like '22'
function getShipMapKeyFromShipData(ship)
{
  return "_" + decodeURIComponent(new URL(ship.wikiUrl).pathname).replace('/','');
}

// generate enum for each type of filter (standard, collab, pr, 
function getStandardShips(ships)
{
  const reg = /^\d+$/;
  let filtered = ships.filter((val) => { return reg.test(val.id); });

  // sort by id number
  filtered.sort((a, b) => a.id - b.id);
  return filtered;
}

// TODO: don't worry about 3xxx id, just grab retrofit property
// no good way to grab the kai ship info rn... but we mostly need images anyways
function getRetrofitShips(ships)
{
}

// Collab "Collab001"
function getCollabShips(ships)
{
  const reg = /^Collab\d+$/;
  let filtered = ships.filter((val) => reg.test(val.id) );
  // sort by id
  filtered.sort((a, b) => {
    const reg = /\d+$/;
    let nameA = a.id.match(reg);
    let nameB = b.id.match(reg);
    return nameA - nameB;
  });
  return filtered
}

function getResearchShips(ships)
{
  const reg = /^Plan\d+$/;
  let filtered = ships.filter((val) => reg.test(val.id));
  // sort by id number
  // todo: generalize into it's own sort function
  filtered.sort((a, b) => {
    const reg = /\d+$/;
    let nameA = a.id.match(reg);
    let nameB = b.id.match(reg);
    return nameA - nameB;
  });
  return filtered;
}

// rarity filter (one or many)
// faction filter (one or many)
// ship type filter (one or many)
// extra filter (has skin, has retrofit, has wedding skin, has l2d skin)
// todo: sort order (rarity, lv. total stats, stat [fp, avi, eva, aa, trp, reld, hp, asw])
// todo 2: use toasts/popcorn to describe what each stat means! [desktop]

// description: map ship data to ship portraits, also generate Ship Card id's
function DoPreProcessing()
{
  // populate images into a map for fast indexing
  for (let s in ShipPortraits)
  {
    let value = ShipPortraits[s];
    let key = getShipMapKeyFromFileName(value);
    ShipPortraitMap[key] = value;
  }

  // for (let i in ShipPortraitMap)
  // {
  //   if (IS_DEBUG()) console.log(`k: ${ShipPortraitMap[i]}, i: ${i}`);
  // }

  // add ship images to ship json (this is necessary as parcel generates filenames)
  // In the future the mapping may be done in a seperate (js?) script... to remove small overhead?
  for (let s of getStandardShips(ShipsDBList))
  {
    let key = getShipMapKeyFromShipData(s);
    let fname = ShipPortraitMap[key];
    if (fname)
    {
      s['shipCardImg'] = fname;
      generateShipCard(s, true);
    }
    else if (IS_DEBUG())
    {
      throw new Error(`Could not find match for ${key} (${fname})`);
    }
  }
}

function generateShipCard(ship, archiveStyle=false)
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
  else if (IS_DEBUG()) {
    throw new Error(`Unknown rarity found: ${rarity}, ${ship.names.en}`);
  }

  // assemble tag contents
  const portrait = ship.shipCardImg;
  const typeIcon = getClassTypeIcon(ship);
  const cashTag = $(
  `<div id="container" class="border border-black rounded-md border-opacity-75 ml-4 mb-4">
    <div id="top-border" class="rounded-t-md h-2 ${topborder}"></div>
    <div id="portrait-container" class="relative flex border-l border-r ${topborder}">
      <div class="absolute top-0 bg-black bg-opacity-50 w-full">
        <img loading="lazy" class="inline-block absolute top-0 left-0 h-full select-none" src="${typeIcon}">
        <div id="level-label" class="text-white text-xl font-semibold text-right leading-none select-none level-font tracking-wider h-5 pr-2">Lv.100</div>
      </div>
      <img loading="lazy" class="border-l-4 border-r-4 border-opacity-75 border-black ${bg}" style="min-width: 144px; min-height: 192px;" src="${portrait}">
      <div class="absolute bottom-0 bg-black bg-opacity-75 text-white text-md tracking-wide align-bottom w-full text-center leading-none select-none name-font truncate mb-3 pb-1 px-2">${ship.names.en}</div>
    </div>
    <div id="bottom-border" class="flex align-centers justify-center relative h-2 rounded-b-md border ${botborder}">
      <div id="star-container" class="absolute bottom-0 leading-none"></div>
    </div>
  </div>`);
  
  if (!archiveStyle)
  {
    generateStarCnt(ship, cashTag);
  }
  else
  {
    cashTag.find("#level-label").text("");
  }

  // add to DOM
  $('#shipcollection')[0].append(cashTag[0]);

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
      shipTag.find('#star-container')[0].append[0](cash[0]);
    }
  }
}

function DoEventBinding()
{
  $("#sort-button").on('click', openModal);
  $("#modal").find("#cancel-button").on('click', hideModal);
  $("#modal").find("#confirm-button").on('click', hideModal);

  function openModal(e)
  {
    $("#modal").removeClass("hidden");
    $("#content").addClass("blur-10 overflow-hidden");
  }
  function hideModal(e)
  {
    $("#modal").addClass("hidden");
    $("#content").removeClass("blur-10 overflow-hidden");
  }
}

function main()
{
  if (IS_DEBUG()) console.log('inside main');
  if (IS_DEBUG()) DoSanityCheck();
  DoPreProcessing();
  DoEventBinding();
  if (IS_DEBUG()) console.log('done pre processing');
}
main();