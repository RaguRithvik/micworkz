import React, { useState, useEffect, useMemo } from 'react';
import CmtVertical from '../../../../../@coremat/CmtNavigation/Vertical';
import PerfectScrollbar from 'react-perfect-scrollbar';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useStore } from '../../../../../helper/Store';

import {
  AccountCircle,
  ArrowForward,
  Category,
  Chat,
  CheckCircle,
  CloudUpload,
  Colorize,
  ContactMail,
  Contacts,
  CollectionsBookmark,
  Domain,
  DonutSmall,
  DragIndicator,
  Edit,
  EditAttributes,
  Email,
  Error,
  Group,
  ImportContacts,
  InsertChart,
  LibraryBooks,
  People,
  LocalGroceryStore,
  LockOutlined,
  Map,
  MonetizationOn,
  NotificationImportant,
  Notifications,
  ShowChart,
  Settings,
  Widgets,
  Search,
  Subtitles,
  AssignmentInd,
  Hotel,
  SingleBed,
  AttachMoney,
  AddToPhotos,
  Security,
  VerifiedUser,
  Lock,
  AddBox,
  LocalOffer,
  PersonAdd,
  Dashboard,
  Room,
  RoomService,
  Label,
  Photo,
  BugReport,
  Report,
  ConfirmationNumber,
  Share,
  PlaylistAddCheck,
  PlaylistAdd,
  AddComment,
  BrightnessMedium,
  Storage,
  AmpStories,
  Assignment,
  Link,
  Note,
  Adjust,
  AddLocation,
  Public,
  GroupWork,
  AccountBalanceWallet,
  AccountBalance,
  Payment,
  Receipt,
} from '@material-ui/icons';
import { Box } from '@material-ui/core';
import LanguageConfig from "../../../../../helper/LanguageConfig";
import { useAuth } from '../../../../../authentication';

const useStyles = makeStyles((theme) => ({
  perfectScrollbarSidebar: {
    height: '100%',
    transition: 'all 0.3s ease',
    '.Cmt-sidebar-fixed &, .Cmt-Drawer-container &': {
      height: 'calc(100% - 167px)',
    },
    '.Cmt-modernLayout &': {
      height: 'calc(100% - 72px)',
    },
    '.Cmt-miniLayout &': {
      height: 'calc(100% - 91px)',
    },
    '.Cmt-miniLayout .Cmt-sidebar-content:hover &': {
      height: 'calc(100% - 167px)',
    },
  },
}));

const SideBar = () => {
  const classes = useStyles();
  const { authUser } = useAuth();
  const { setFormname, formname } = useStore()
  const { currentAppMenu } = useStore();
  const [menus, setMenus] = useState([]);
  const myicons = {
    Dashboard: <Dashboard />,
    AddLocation: <AddLocation />,
    AccountBalanceWallet: <AccountBalanceWallet />,
    People: <People />,
    Adjust: <Adjust />,
    Search: <Search />,
    LibraryBooks: <LibraryBooks />,
    ConfirmationNumber: <ConfirmationNumber />
  };

  useEffect(() => {
    if (authUser) {
      let navigationMenusArray = [];
      currentAppMenu.map(menu1 => {
        if (menu1["menu-child"].length > 0) {
          // if (menu1["menu-child"].length > 0 && menu1["url-link"] === null) {
          let subMenu = [];
          menu1["menu-child"].map(data => {
            if (data["menu-child"].length > 0) {
              // if(data["menu-child"].length > 0 && data["url-link"] === null){
              let nestSubMenus = [];
              data["menu-child"].map(menu3 => {
                nestSubMenus.push({
                  name: menu3["menu-name"],
                  type: 'item',
                  icon: myicons[menu3["icon"]] !== undefined ? myicons[menu3["icon"]] : <ArrowForward />,
                  link: menu3["url-link"] === null ? '#' : menu3["url-link"],
                });
              });

              subMenu.push({
                name: data["menu-name"],
                type: 'collapse',
                icon: myicons[data["icon"]] !== undefined ? myicons[data["icon"]] : <Dashboard />,
                link: data["url-link"] === null ? '#' : data["url-link"],
                children: nestSubMenus
              });
            } else {
              subMenu.push({
                name: data["menu-name"],
                type: 'item',
                icon: myicons[data["icon"]] !== undefined ? myicons[data["icon"]] : <Dashboard />,
                link: data["url-link"] === null ? '#' : data["url-link"],
              });
            }
          });
          navigationMenusArray.push({
            name: menu1["menu-name"],
            type: 'section',
            icon: myicons[menu1["icon"]] !== undefined ? myicons[menu1["icon"]] : <Widgets />,
            children: subMenu,
          });
        } else {
          navigationMenusArray.push(
            {
              name: menu1["menu-name"],
              type: 'item',
              icon: myicons[menu1["icon"]] !== undefined ? myicons[menu1["icon"]] : <Widgets />,
              link: menu1["url-link"] === null ? '#' : menu1["url-link"],
            }
          );
        }
      });

      setMenus(navigationMenusArray);
    }
  }, [authUser, currentAppMenu]);
  
  
  let menuget = authUser.userMenu
  let dashboard = "dashboard"
  useEffect(() => {
    const geturl = window.location.pathname
    var geturllink = geturl ? geturl : ''
    var lastIndex = geturllink.lastIndexOf("/");
    geturllink = geturllink.substring(0, lastIndex);
    const getsidebar = menuget.map(getmenu => (getmenu["menu-child"].map(ndata => ndata['menu-child'].map(indata => indata['url-link'] == geturl ? indata['menu-name'] : indata['url-link'] == geturllink ? indata['menu-name'] : ''))))
    var op = getsidebar.map((f => (f.map(nf => (nf.filter(v => v != ""))))))
    for (let b in op) {
      for (let cd in op[b]) {
        if (op[b][cd].length > 0) {
          var getcon = op[b][cd][0]
        }
      }
    }
    setFormname(getcon ? getcon : dashboard)
  }, [formname])

  // const userMenu = [
  //   {
  //     "parent-key": "nBvBlP/X6Cd/fCcbNYdw1ZE3q/A3JKNW3AMohzqRybw=",
  //     "child-key": "2sCl2ZwWgTup1RcRV8Nf9mkgHjACWj9Lf9wirbOATSc=",
  //     "menu-name": "Dashboard",
  //     "url-link": "/dashboard/",
  //     "icon": "Dashboard",
  //     "menu-child": []
  //   },
  //   {
  //     "parent-key": "W5xf10qrzrYdPpu/dG2cetIqO2uAH3EFb4MgsKANJeE=",
  //     "child-key": "aT5YI14CwgJPjchsniEmkMaklLD0y7YVFcJBlSaFPGo=",
  //     "menu-name": "Near Places Type",
  //     "url-link": null,
  //     "menu-child": [
  //       {
  //         "parent-key": "W5xf10qrzrYdPpu/dG2cetIqO2uAH3EFb4MgsKANJeE=",
  //         "child-key": "aT5YI14CwgJPjchsniEmkMaklLD0y7YVFcJBlSaFPGo=",
  //         "menu-name": "Near Places Type",
  //         "url-link": "/dashboard/HotelSetup/NearPlaceType/",
  //         "icon": "Adjust",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "aT5YI14CwgJPjchsniEmkMaklLD0y7YVFcJBlSaFPGo=",
  //         "child-key": "3U3h8NhijxMup7rLtl/0o2jYbTCsIobTKrjTQbu93AI=",
  //         "menu-name": "Booking",
  //         "url-link": null,
  //         "icon": "LibraryBooks",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "aT5YI14CwgJPjchsniEmkMaklLD0y7YVFcJBlSaFPGo=",
  //         "child-key": "i0jzf413Ruce/NRVMdQNQRO8co3VlCg27QmlrmXcifs=",
  //         "menu-name": "Hotel",
  //         "url-link": '/dashboard/searchhotels/',
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "aT5YI14CwgJPjchsniEmkMaklLD0y7YVFcJBlSaFPGo=",
  //         "child-key": "OpdNcNDbZw6oI//c3sYLO4YBcJR5bnetvh0PEtiJiHM=",
  //         "menu-name": "Attractions",
  //         "url-link": "/dashboard/Attractions/",
  //         "icon": "ConfirmationNumber",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "aT5YI14CwgJPjchsniEmkMaklLD0y7YVFcJBlSaFPGo=",
  //         "child-key": "asevZ8o9N/IkGmjgDIggcqkKzFKurBBomVN6vTEA27I=",
  //         "menu-name": "Events",
  //         "url-link": "/dashboard/Events/",
  //         "icon": "ConfirmationNumber",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "aT5YI14CwgJPjchsniEmkMaklLD0y7YVFcJBlSaFPGo=",
  //         "child-key": "7VbC8mWrIZoQUA1P3iafcpQmhLDAiBousOEyGAT/EcI=",
  //         "menu-name": "Flights",
  //         "url-link": null,
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "aT5YI14CwgJPjchsniEmkMaklLD0y7YVFcJBlSaFPGo=",
  //         "child-key": "CBK0W/aq9GUMThsDRfCyi1QXpV0RRuEZeDZ81K9iBG4=",
  //         "menu-name": "My Booking",
  //         "url-link": null,
  //         "icon": "Search",
  //         "menu-child": []
  //       }
  //     ]
  //   },
  //   {
  //     "parent-key": "W5xf10qrzrYdPpu/dG2cetIqO2uAH3EFb4MgsKANJeE=",
  //     "child-key": "cFoQ6IfItkmjDiCAONXYNE9Xw8cByLzK0vqWvkQ/tkI=",
  //     "menu-name": "Near Places",
  //     "url-link": null,
  //     "icon": "AddLocation",
  //     "menu-child": [
  //       {
  //         "parent-key": "W5xf10qrzrYdPpu/dG2cetIqO2uAH3EFb4MgsKANJeE=",
  //         "child-key": "cFoQ6IfItkmjDiCAONXYNE9Xw8cByLzK0vqWvkQ/tkI=",
  //         "menu-name": "Near Places",
  //         "url-link": '/dashboard/HotelSetup/NearPlace/',
  //         "icon": "AddLocation",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "cFoQ6IfItkmjDiCAONXYNE9Xw8cByLzK0vqWvkQ/tkI=",
  //         "child-key": "mGDHm+LyFBG9w+b7Ip5Etv/q6Xcbxa+wYPcdkCXPJ4M=",
  //         "menu-name": "Hotel Management",
  //         "url-link": null,
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "cFoQ6IfItkmjDiCAONXYNE9Xw8cByLzK0vqWvkQ/tkI=",
  //         "child-key": "slz7xv1KdfSdyh377LyAByhzVEYVKANp+bALUkMr3h4=",
  //         "menu-name": "Amenity Type",
  //         "url-link": "/dashboard/Hotel/AmenityType",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "cFoQ6IfItkmjDiCAONXYNE9Xw8cByLzK0vqWvkQ/tkI=",
  //         "child-key": "tM7l9evdmqxcNuQNHzmGKfnqL2J4Yath+eL3zZFiuYc=",
  //         "menu-name": "Amenity",
  //         "url-link": "/dashboard/Hotel/Amenity",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "cFoQ6IfItkmjDiCAONXYNE9Xw8cByLzK0vqWvkQ/tkI=",
  //         "child-key": "kbHSL/jWGPial7t8aPTL5cdldnuQrekvgrDC5PlEAjg=",
  //         "menu-name": "Hotel Category",
  //         "url-link": "/dashboard/Hotel/Category",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "cFoQ6IfItkmjDiCAONXYNE9Xw8cByLzK0vqWvkQ/tkI=",
  //         "child-key": "dpmuWXOw4/jkle1X5iGYolvC6yuavygms8BIHZTlk7A=",
  //         "menu-name": "Hotel Tags",
  //         "url-link": "/dashboard/Hotel/HotelTag",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "cFoQ6IfItkmjDiCAONXYNE9Xw8cByLzK0vqWvkQ/tkI=",
  //         "child-key": "1ApIBDdLMhlLPVSuN6PbmAWfgPKB4zwvgKMjvff0rx8=",
  //         "menu-name": "Hotel Image Type",
  //         "url-link": "/dashboard/Hotel/HotelImageType",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "cFoQ6IfItkmjDiCAONXYNE9Xw8cByLzK0vqWvkQ/tkI=",
  //         "child-key": "1qIqrTGXjGsooz3Qbie72Rgnh7vf+p5kqsVjBo+LeKA=",
  //         "menu-name": "hotel Issues",
  //         "url-link": "/dashboard/Hotel/HotelIssues",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "cFoQ6IfItkmjDiCAONXYNE9Xw8cByLzK0vqWvkQ/tkI=",
  //         "child-key": "GxvTYaghlg/8TUcwGZAkJGMGaS5MX9GG253lk0z3sjY=",
  //         "menu-name": "Hotel Setup",
  //         "url-link": "/dashboard/Hotel/",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "cFoQ6IfItkmjDiCAONXYNE9Xw8cByLzK0vqWvkQ/tkI=",
  //         "child-key": "ryoxoVIxhwGIJ0wXEEQfeT9FmZ0vp/JoGh/crHZWPzw=",
  //         "menu-name": "Room Category",
  //         "url-link": "/dashboard/Hotel/RoomCategory",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "cFoQ6IfItkmjDiCAONXYNE9Xw8cByLzK0vqWvkQ/tkI=",
  //         "child-key": "zizXgrJ8Wiege45KkMcrNyCHoyV6RrWBRuq7UZCU9EE=",
  //         "menu-name": "Room Setup",
  //         "url-link": "/dashboard/Hotel/Room",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "cFoQ6IfItkmjDiCAONXYNE9Xw8cByLzK0vqWvkQ/tkI=",
  //         "child-key": "wu0xeZYXp696Y5pxa/BN7g7HZww489M5gSZtIJWFVlQ=",
  //         "menu-name": "Room Plan",
  //         "url-link": "/dashboard/Hotel/RoomPlan",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "cFoQ6IfItkmjDiCAONXYNE9Xw8cByLzK0vqWvkQ/tkI=",
  //         "child-key": "6NPd/l3e0sU8M+BL8wJHl3YMLLmezxLYZ6fahRvvNnQ=",
  //         "menu-name": "Room Night Setup",
  //         "url-link": "/dashboard/HotelSetup/RoomNightSetup",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "cFoQ6IfItkmjDiCAONXYNE9Xw8cByLzK0vqWvkQ/tkI=",
  //         "child-key": "H0q77G2H1F0+kX8/KNkswDDyjTd9ofPSJQ9JBWCbro8=",
  //         "menu-name": "Room Price Comments",
  //         "url-link": "/dashboard/Hotel/RoomPriceComment",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "cFoQ6IfItkmjDiCAONXYNE9Xw8cByLzK0vqWvkQ/tkI=",
  //         "child-key": "gbkidJuUghjfoYKu46S7yBDQa+OqxDP/zFn+xwy/kAQ=",
  //         "menu-name": "Room Price Setup",
  //         "url-link": "/dashboard/Hotel/RoomPricePlan",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "cFoQ6IfItkmjDiCAONXYNE9Xw8cByLzK0vqWvkQ/tkI=",
  //         "child-key": "RU19Icg0VDATjQ//sSZu54afKO/f1RqslPuY3dziXD8=",
  //         "menu-name": "Hotel & Room Link",
  //         "url-link": "/dashboard/Hotel/HotelRoomLink",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "cFoQ6IfItkmjDiCAONXYNE9Xw8cByLzK0vqWvkQ/tkI=",
  //         "child-key": "eYUccnFKVRiMSx1rEo7D1EekCpgyTY8vAvTHhLq+d7A=",
  //         "menu-name": "API Configuration",
  //         "url-link": null,
  //         "icon": "Search",
  //         "menu-child": []
  //       }
  //     ]
  //   },
  //   {
  //     "parent-key": "W5xf10qrzrYdPpu/dG2cetIqO2uAH3EFb4MgsKANJeE=",
  //     "child-key": "PY8UQ/isJGxivemahk+L2PnHhCAkH7TK9l8KcVn5gGo=",
  //     "menu-name": "My Profile",
  //     "url-link": null,
  //     "icon": "People",
  //     "menu-child": [
  //       {
  //         "parent-key": "PY8UQ/isJGxivemahk+L2PnHhCAkH7TK9l8KcVn5gGo=",
  //         "child-key": "JGUBgo/CKEuTSME25hZL7vjFdWQS5kyW1c0brolzdgA=",
  //         "menu-name": "Attractions Management",
  //         "url-link": null,
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "PY8UQ/isJGxivemahk+L2PnHhCAkH7TK9l8KcVn5gGo=",
  //         "child-key": "UZVkCxRcpeFMZfMDClxFGxvx7r7yQW77rfiAiFLBD4s=",
  //         "menu-name": "Amenity Type",
  //         "url-link": "/dashboard/Attractions/AmenityType",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "PY8UQ/isJGxivemahk+L2PnHhCAkH7TK9l8KcVn5gGo=",
  //         "child-key": "USQje6nw42ksTYKtMBXNRW4yuVXFrq+EAFPaYhaliQE=",
  //         "menu-name": "Amenity",
  //         "url-link": "/dashboard/Attractions/Amenity",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "PY8UQ/isJGxivemahk+L2PnHhCAkH7TK9l8KcVn5gGo=",
  //         "child-key": "iuAwZXBp0F7NRCnZv14PS0yrz3XPOr0jUxmgg81kUSg=",
  //         "menu-name": "Attractions Type",
  //         "url-link": "/dashboard/Attractions/TicketType",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "PY8UQ/isJGxivemahk+L2PnHhCAkH7TK9l8KcVn5gGo=",
  //         "child-key": "mGndc36nf/QHEF7nmrvDKG5gZvD92OUd9GEMV86STLA=",
  //         "menu-name": "Attractions Tags",
  //         "url-link": "/dashboard/Attractions/TicketTag",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "PY8UQ/isJGxivemahk+L2PnHhCAkH7TK9l8KcVn5gGo=",
  //         "child-key": "tRPPy6nBK2w+OmqS4Q/0yMXsjb1mMhAQqBAGgA6S/Z4=",
  //         "menu-name": "Attractions Image Type",
  //         "url-link": "/dashboard/Attractions/ImageType",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "PY8UQ/isJGxivemahk+L2PnHhCAkH7TK9l8KcVn5gGo=",
  //         "child-key": "T7OoYZVv6fqzOcpHDyYuVxKKcpzgF5Nb+fAPBA6F7ZA=",
  //         "menu-name": "Supplier Setup",
  //         "url-link": "/dashboard/Attractions/TicketSupplier",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "PY8UQ/isJGxivemahk+L2PnHhCAkH7TK9l8KcVn5gGo=",
  //         "child-key": "FNQA7seTAGVIXHHZIHeiiK4ILKX6+QbPFATYVPfokOM=",
  //         "menu-name": "Ticket Category",
  //         "url-link": "/dashboard/Attractions/TicketCategory",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "PY8UQ/isJGxivemahk+L2PnHhCAkH7TK9l8KcVn5gGo=",
  //         "child-key": "qdZmGLzjT39/VbEp7hnACKBj98UV5NO9hBCHqr8anPg=",
  //         "menu-name": "Attractions Setup",
  //         "url-link": "/dashboard/Attractions/",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "PY8UQ/isJGxivemahk+L2PnHhCAkH7TK9l8KcVn5gGo=",
  //         "child-key": "6meLRQ8je85NKHV/GMgcpQWpo9cSvuz1nhkCE/MBHvo=",
  //         "menu-name": "Attractions Plan",
  //         "url-link": "/dashboard/Attractions/TicketPlan",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "PY8UQ/isJGxivemahk+L2PnHhCAkH7TK9l8KcVn5gGo=",
  //         "child-key": "DJWPuGbUpSZcb1HRcztRp4jTQ7HSqHYxhf6Z4b01zEc=",
  //         "menu-name": "Attractions Price Comments",
  //         "url-link": "/dashboard/Attractions/TicketPriceComments",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "PY8UQ/isJGxivemahk+L2PnHhCAkH7TK9l8KcVn5gGo=",
  //         "child-key": "7uCfySgtVdEEL2JkrucxWHL4NHX0Ud28+4Ei6c+RBcg=",
  //         "menu-name": "Attractions Seasonality Price Setup",
  //         "url-link": "/dashboard/Attractions/TicketPricePlan",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "PY8UQ/isJGxivemahk+L2PnHhCAkH7TK9l8KcVn5gGo=",
  //         "child-key": "N/wqHmiWCpc188YOY6IJ4vHOYfdmZhbRK7hc8Qjc2Z0=",
  //         "menu-name": "Opening Stock",
  //         "url-link": "/dashboard/Attractions/TicketStock",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "PY8UQ/isJGxivemahk+L2PnHhCAkH7TK9l8KcVn5gGo=",
  //         "child-key": "+aAVXXZv+Kfnsh6Nx5a+whlzNG8zZGzGYVMCij9LvBs=",
  //         "menu-name": "Purchase Stock",
  //         "url-link": "/dashboard/Attractions/TicketPurchase",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "PY8UQ/isJGxivemahk+L2PnHhCAkH7TK9l8KcVn5gGo=",
  //         "child-key": "cbvzEz+39SBsDu+vxk9ksk2IrBeb+nqV1prvBhOE3AA=",
  //         "menu-name": "API Configurations",
  //         "url-link": null,
  //         "icon": "Search",
  //         "menu-child": []
  //       }
  //     ]
  //   },
  //   {
  //     "parent-key": "W5xf10qrzrYdPpu/dG2cetIqO2uAH3EFb4MgsKANJeE=",
  //     "child-key": "SMUtnnYC25fLt97y9wR6RSUJop7UXU0BQtY4q6hKRrU=",
  //     "menu-name": "Wallet Topup",
  //     "url-link": null,
  //     "icon": "AccountBalanceWallet",
  //     "menu-child": [
  //       {
  //         "parent-key": "SMUtnnYC25fLt97y9wR6RSUJop7UXU0BQtY4q6hKRrU=",
  //         "child-key": "sR2i/iWYdRO6/jpVk8KpTVlFebeii5KuLeDTdocGoYg=",
  //         "menu-name": "Flight Management",
  //         "url-link": null,
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "SMUtnnYC25fLt97y9wR6RSUJop7UXU0BQtY4q6hKRrU=",
  //         "child-key": "bz+lWtYG/unZWs6Ljc0G0N563ykd/dHEE47UAme0JCg=",
  //         "menu-name": "API Configuration",
  //         "url-link": null,
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "SMUtnnYC25fLt97y9wR6RSUJop7UXU0BQtY4q6hKRrU=",
  //         "child-key": "bewHWuvecXT3zqz7JZa5urjXoJ/qjFzCnpEeJQp7PfQ=",
  //         "menu-name": "Airline Integration",
  //         "url-link": null,
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "SMUtnnYC25fLt97y9wR6RSUJop7UXU0BQtY4q6hKRrU=",
  //         "child-key": "yyo/egNDtHuVtoizdJi/HurL/JNtalrWmQBXKNbCZWs=",
  //         "menu-name": "Airline Setup (City Wise)",
  //         "url-link": null,
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "SMUtnnYC25fLt97y9wR6RSUJop7UXU0BQtY4q6hKRrU=",
  //         "child-key": "iIupCt1A0CxBhPJLZqsVrzZ3mjoZJpQpQu0X/+SNPDA=",
  //         "menu-name": "Seating Class Setup",
  //         "url-link": null,
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "SMUtnnYC25fLt97y9wR6RSUJop7UXU0BQtY4q6hKRrU=",
  //         "child-key": "7MjRNIgPN/VTB41CHgLJzRbw3qQmePKZDlZlntGjw/Q=",
  //         "menu-name": "Markup Setup (Seating Class wise)",
  //         "url-link": null,
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "SMUtnnYC25fLt97y9wR6RSUJop7UXU0BQtY4q6hKRrU=",
  //         "child-key": "gOEezxb8pZXLMm1emjEu2lXUzr1te7MKY493s//5d34=",
  //         "menu-name": "Markup Setup (Per Book or Per Pax)",
  //         "url-link": null,
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "SMUtnnYC25fLt97y9wR6RSUJop7UXU0BQtY4q6hKRrU=",
  //         "child-key": "V6nK/w2WyLpY44mT7j2UXBk0KCzHMnOgy7Rygk26Cvk=",
  //         "menu-name": "Book and Hold",
  //         "url-link": null,
  //         "icon": "Search",
  //         "menu-child": []
  //       }
  //     ]
  //   },
  //   {
  //     "parent-key": "W5xf10qrzrYdPpu/dG2cetIqO2uAH3EFb4MgsKANJeE=",
  //     "child-key": "i5nOs3MeXynmEfyyQCqHxNGcUgsEYrMa8DOcrq3IDo0=",
  //     "menu-name": "My Page",
  //     "url-link": null,
  //     "icon": "Search",
  //     "menu-child": [
  //       {
  //         "parent-key": "i5nOs3MeXynmEfyyQCqHxNGcUgsEYrMa8DOcrq3IDo0=",
  //         "child-key": "+VQXSZZWj18FK+evvtv3dN3EZ2shF7MuJFHDS3+N0hI=",
  //         "menu-name": "Report",
  //         "url-link": null,
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "i5nOs3MeXynmEfyyQCqHxNGcUgsEYrMa8DOcrq3IDo0=",
  //         "child-key": "Ewg55TMLuoRedVyx62+n/vVq6qHX9gu3C4kx9sY07ho=",
  //         "menu-name": "Booking",
  //         "url-link": null,
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "i5nOs3MeXynmEfyyQCqHxNGcUgsEYrMa8DOcrq3IDo0=",
  //         "child-key": "f8jgHTrqHx4AXelI/Fq9LmUx3AgonVMOIrnXcJBThGw=",
  //         "menu-name": "Account Balance",
  //         "url-link": null,
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "i5nOs3MeXynmEfyyQCqHxNGcUgsEYrMa8DOcrq3IDo0=",
  //         "child-key": "pN3BNwvtpPGzb+pG9VxnpX7O8bqWR3SwF8lcL1sydBk=",
  //         "menu-name": "Account Cumm",
  //         "url-link": null,
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "i5nOs3MeXynmEfyyQCqHxNGcUgsEYrMa8DOcrq3IDo0=",
  //         "child-key": "spOZDtLzIdJDUBDzo9utEQeZTc+ZangBHH1cSlVnskc=",
  //         "menu-name": "Account Cumm Summary",
  //         "url-link": null,
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "i5nOs3MeXynmEfyyQCqHxNGcUgsEYrMa8DOcrq3IDo0=",
  //         "child-key": "RSxRV7Qcn9PuWIAO6Uk02vlKcNQ+TaB5IKCpLAg1Jaw=",
  //         "menu-name": "Account Journal",
  //         "url-link": null,
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "i5nOs3MeXynmEfyyQCqHxNGcUgsEYrMa8DOcrq3IDo0=",
  //         "child-key": "V6D35OfQEvUzS3sA+ogSMx4/1WJx5SqZ8EvADVyl4m8=",
  //         "menu-name": "Expense",
  //         "url-link": null,
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "i5nOs3MeXynmEfyyQCqHxNGcUgsEYrMa8DOcrq3IDo0=",
  //         "child-key": "c3Fl3Uwk39a8rPQSgeUlZ1M1xrQNrRDOP6vjQfeu8AQ=",
  //         "menu-name": "Profit",
  //         "url-link": null,
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "i5nOs3MeXynmEfyyQCqHxNGcUgsEYrMa8DOcrq3IDo0=",
  //         "child-key": "lrWrMPj/CDkqUm2jmczu2FMmQJc3/K07hqFgaf4MWJ4=",
  //         "menu-name": "Sales Report",
  //         "url-link": null,
  //         "icon": "Search",
  //         "menu-child": []
  //       }
  //     ]
  //   },
  //   {
  //     "parent-key": "lCleTmKfT6c340jnobqg+rI1aVC3Ji3oblV46H+Mc+o=",
  //     "child-key": "meVAGWycL2xEULygzJB79qUsL2FyiJKI6GXbuo+8L2w=",
  //     "menu-name": "Cities",
  //     "url-link": null,
  //     "icon": "AddLocation",
  //     "menu-child": [
  //       {
  //         "parent-key": "meVAGWycL2xEULygzJB79qUsL2FyiJKI6GXbuo+8L2w=",
  //         "child-key": "HV9qcrCZZ1JoMEcstqJSURnG1kqTyVu+5Tj+j0Al3nI=",
  //         "menu-name": "Event Management",
  //         "url-link": null,
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "meVAGWycL2xEULygzJB79qUsL2FyiJKI6GXbuo+8L2w=",
  //         "child-key": "4sQAz8oZWgX2rSSkJglk1MKNKkFO8pGsuLJdWxHDvvM=",
  //         "menu-name": "Amenity Type",
  //         "url-link": "/dashboard/Events/AmenityType",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "meVAGWycL2xEULygzJB79qUsL2FyiJKI6GXbuo+8L2w=",
  //         "child-key": "9rrKykPLB0okgfLLruJLHeLO0aa+3FodhLLg5PLh6Wo=",
  //         "menu-name": "Amenity",
  //         "url-link": "/dashboard/Events/Amenity",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "meVAGWycL2xEULygzJB79qUsL2FyiJKI6GXbuo+8L2w=",
  //         "child-key": "evn6SRyolSmSOc3gbKU4RSAK/VpNmliA+onXYRD9RrY=",
  //         "menu-name": "Event Ticket Type",
  //         "url-link": "/dashboard/Events/TicketType",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "meVAGWycL2xEULygzJB79qUsL2FyiJKI6GXbuo+8L2w=",
  //         "child-key": "2PD8/cCJRVfr1xjitZneqhvYeW5w30oSUGxoSLclB2E=",
  //         "menu-name": "Event Tags",
  //         "url-link": "/dashboard/Events/TicketTag",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "meVAGWycL2xEULygzJB79qUsL2FyiJKI6GXbuo+8L2w=",
  //         "child-key": "X1sUd3SKvj6DB3wHkqriqK4IIvXYJ2KGOnttjdCa8dU=",
  //         "menu-name": "Event Image Type",
  //         "url-link": "/dashboard/Events/ImageType",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "meVAGWycL2xEULygzJB79qUsL2FyiJKI6GXbuo+8L2w=",
  //         "child-key": "YPlaE/B+wjYDnSiuIq+nkNOWCREftmWtgduZmjGmOOY=",
  //         "menu-name": "Event Location / Supplier Setup",
  //         "url-link": "/dashboard/Events/TicketSupplier",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "meVAGWycL2xEULygzJB79qUsL2FyiJKI6GXbuo+8L2w=",
  //         "child-key": "WNUVCjcC+BIkcLLhD0cwP0i/I5zNMR7cem4rTkXSLjM=",
  //         "menu-name": "Ticket Category",
  //         "url-link": "/dashboard/Events/TicketCategory",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "meVAGWycL2xEULygzJB79qUsL2FyiJKI6GXbuo+8L2w=",
  //         "child-key": "NH5cddcv6MGO7LAvgVCHXI0DLSyZcZs44rDOo2qzA9w=",
  //         "menu-name": "Event Setup",
  //         "url-link": "/dashboard/Events/",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "meVAGWycL2xEULygzJB79qUsL2FyiJKI6GXbuo+8L2w=",
  //         "child-key": "UuIzsrqkDOyt+HYOXTT6IB8nDy5Pkbahf303cmcbbQs=",
  //         "menu-name": "Event Plan",
  //         "url-link": "/dashboard/Events/TicketPlan",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "meVAGWycL2xEULygzJB79qUsL2FyiJKI6GXbuo+8L2w=",
  //         "child-key": "figaTIv396zLCEWNPUgxwMjStiIdclYHuNExhLMNRKc=",
  //         "menu-name": "Event Price Comments",
  //         "url-link": "/dashboard/Events/TicketPriceComments",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "meVAGWycL2xEULygzJB79qUsL2FyiJKI6GXbuo+8L2w=",
  //         "child-key": "nbSR54kgk/vmmF5ldaBLu6Et1nPTx4FvP3+NBMB+HOU=",
  //         "menu-name": "Event Seasonality Price Setup",
  //         "url-link": "/dashboard/Events/TicketPricePlan",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "meVAGWycL2xEULygzJB79qUsL2FyiJKI6GXbuo+8L2w=",
  //         "child-key": "RWLb9PpStaO8PCF3P12WZTKtY02xL7P/4WxPzeVztSI=",
  //         "menu-name": "Opening Stock",
  //         "url-link": "/dashboard/Events/TicketStock",
  //         "icon": "Search",
  //         "menu-child": []
  //       },
  //       {
  //         "parent-key": "meVAGWycL2xEULygzJB79qUsL2FyiJKI6GXbuo+8L2w=",
  //         "child-key": "M7Jw1QMUr11z4IInMEoNORSv5CiL6aZQcFC70kawlTc=",
  //         "menu-name": "Purchase Stock",
  //         "url-link": "/dashboard/Events/TicketPurchase",
  //         "icon": "Search",
  //         "menu-child": []
  //       }
  //     ]
  //   }
  // ];

  // const navigationMenus1 = [];
  // userMenu.map(data => {
  //   if (data["menu-child"].length > 0) {
  //     let subMenu = [];
  //     data["menu-child"].map(el => {
  //       subMenu.push({
  //         name: el["menu-name"],
  //         type: 'item',
  //         icon: myicons[el["icon"]] !== undefined ? myicons[el["icon"]] : <Widgets />,
  //         link: el["url-link"] === null ? '#' : el["url-link"],
  //       })
  //     });
  //     navigationMenus1.push({
  //       name: data["menu-name"],
  //       type: 'collapse',
  //       icon: myicons[data["icon"]] !== undefined ? myicons[data["icon"]] : <Widgets />,
  //       children: subMenu,
  //     });
  //   } else {
  //     navigationMenus1.push(
  //       {
  //         name: data["menu-name"],
  //         type: 'item',
  //         icon: myicons[data["icon"]] !== undefined ? myicons[data["icon"]] : <Widgets />,
  //         link: data["url-link"] === null ? '#' : data["url-link"],
  //       }
  //     );
  //   }
  // });
  // const navigationMenus = [
  //   {
  //     name: '',
  //     type: 'section',
  //     children: [
  //       {
  //         name: <LanguageConfig id={'menus.dasboard'} />,
  //         icon: <Dashboard />,
  //         type: 'item',
  //         link: '/dashboard/',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.hotels'} />,
  //         icon: <Search />,
  //         type: 'item',
  //         link: '/dashboard/searchhotels/',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.hotelcategory'} />,
  //         icon: <Hotel />,
  //         type: 'item',
  //         link: '/dashboard/Hotel/Category',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.hoteltags'} />,
  //         icon: <Label />,
  //         type: 'item',
  //         link: '/dashboard/Hotel/HotelTag',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.hotelimagetype'} />,
  //         icon: <Photo />,
  //         type: 'item',
  //         link: '/dashboard/Hotel/HotelImageType',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.hotelissues'} />,
  //         icon: <Report />,
  //         type: 'item',
  //         link: '/dashboard/Hotel/HotelIssues',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.hotelroomlink'} />,
  //         icon: <Link />,
  //         type: 'item',
  //         link: '/dashboard/Hotel/HotelRoomLink',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.managehotel'} />,
  //         icon: <AddToPhotos />,
  //         type: 'item',
  //         link: '/dashboard/Hotel/',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.roomnightsetup'} />,
  //         icon: <BrightnessMedium />,
  //         type: 'item',
  //         link: '/dashboard/HotelSetup/RoomNightSetup',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.roomcategory'} />,
  //         icon: <RoomService />,
  //         type: 'item',
  //         link: '/dashboard/Hotel/RoomCategory',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.roomplan'} />,
  //         icon: <Assignment />,
  //         type: 'item',
  //         link: '/dashboard/Hotel/RoomPlan',
  //       },
  //       {
  //         name: <LanguageConfig id={'Room Price Plan'} />,
  //         icon: <AttachMoney />,
  //         type: 'item',
  //         link: '/dashboard/Hotel/RoomPricePlan',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.roompricecomment'} />,
  //         icon: <AddComment />,
  //         type: 'item',
  //         link: '/dashboard/Hotel/RoomPriceComment',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.managerooms'} />,
  //         icon: <Room />,
  //         type: 'item',
  //         link: '/dashboard/Hotel/Room',
  //       },

  //       {
  //         name: <LanguageConfig id={'menus.amenity'} />,
  //         icon: <Security />,
  //         type: 'item',
  //         link: '/dashboard/Hotel/Amenity',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.amenitytype'} />,
  //         icon: <VerifiedUser />,
  //         type: 'item',
  //         link: '/dashboard/Hotel/AmenityType',
  //       },
  //       {
  //         name: <LanguageConfig id={'Near Place'} />,
  //         icon: <AddLocation />,
  //         type: 'item',
  //         link: '/dashboard/HotelSetup/NearPlace/',
  //       },
  //       {
  //         name: <LanguageConfig id={'Near Place Type'} />,
  //         icon: <Adjust />,
  //         type: 'item',
  //         link: '/dashboard/HotelSetup/NearPlaceType/',
  //       },
  //       // {
  //       //   name: <LanguageConfig id={'SetUp'} />,
  //       //   icon: <AddBox />,
  //       //   type: 'item',
  //       //   link: '/dashboard/Attraction/SetUp',
  //       // },

  //       // {
  //       //   name: <LanguageConfig id={'Attraction Opening Stock'} />,
  //       //   icon: <ShowChart />,
  //       //   type: 'item',
  //       //   link: '/dashboard/Attraction/AttractionOpeningStock',
  //       // },
  //       // {
  //       //   name: <LanguageConfig id={'Selling Price SetUp'} />,
  //       //   icon: <LocalOffer />,
  //       //   type: 'item',
  //       //   link: '/dashboard/Attraction/SellingPriceSetUp',
  //       // },
  //       {
  //         name: <LanguageConfig id={'menus.managetickets'} />,
  //         icon: <ConfirmationNumber />,
  //         type: 'item',
  //         link: '/dashboard/Events/',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.tickettype'} />,
  //         icon: <AmpStories />,
  //         type: 'item',
  //         link: '/dashboard/Events/TicketType',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.ticketamenity'} />,
  //         icon: <PlaylistAddCheck />,
  //         type: 'item',
  //         link: '/dashboard/Events/Amenity',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.ticketamenitytype'} />,
  //         icon: <PlaylistAdd />,
  //         type: 'item',
  //         link: '/dashboard/Events/AmenityType',
  //       },

  //       {
  //         name: <LanguageConfig id={'menus.ticketsupplier'} />,
  //         icon: <Share />,
  //         type: 'item',
  //         link: '/dashboard/Events/TicketSupplier',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.supplierticketstock'} />,
  //         icon: <Storage />,
  //         type: 'item',
  //         link: '/dashboard/Events/TicketSupplierStock',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.ticketimagetype'} />,
  //         icon: <LibraryBooks />,
  //         type: 'item',
  //         link: '/dashboard/Events/ImageType',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.tickettag'} />,
  //         icon: <DonutSmall />,
  //         type: 'item',
  //         link: '/dashboard/Events/TicketTag',
  //       },
  //       {
  //         name: 'Ticket Category',
  //         icon: <DonutSmall />,
  //         type: 'item',
  //         link: '/dashboard/Events/TicketCategory',
  //       },
  //       {
  //         name: <LanguageConfig id={'Ticket Price Comments'} />,
  //         icon: <AddComment />,
  //         type: 'item',
  //         link: '/dashboard/Events/TicketPriceComments',
  //       },
  //       {
  //         name: <LanguageConfig id={'Ticket Price Plan'} />,
  //         icon: <AttachMoney />,
  //         type: 'item',
  //         link: '/dashboard/Events/TicketPricePlan',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.ticketplan'} />,
  //         icon: <Note />,
  //         type: 'item',
  //         link: '/dashboard/Events/TicketPlan',
  //       },
  //       {
  //         name: <LanguageConfig id={'Ticket stock'} />,
  //         icon: <Note />,
  //         type: 'item',
  //         link: '/dashboard/Events/TicketStock',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.managetickets'} />,
  //         icon: <ConfirmationNumber />,
  //         type: 'item',
  //         link: '/dashboard/Attractions/',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.tickettype'} />,
  //         icon: <AmpStories />,
  //         type: 'item',
  //         link: '/dashboard/Attractions/TicketType',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.ticketamenity'} />,
  //         icon: <PlaylistAddCheck />,
  //         type: 'item',
  //         link: '/dashboard/Attractions/Amenity',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.ticketamenitytype'} />,
  //         icon: <PlaylistAdd />,
  //         type: 'item',
  //         link: '/dashboard/Attractions/AmenityType',
  //       },

  //       {
  //         name: <LanguageConfig id={'menus.ticketsupplier'} />,
  //         icon: <Share />,
  //         type: 'item',
  //         link: '/dashboard/Attractions/TicketSupplier',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.supplierticketstock'} />,
  //         icon: <Storage />,
  //         type: 'item',
  //         link: '/dashboard/Attractions/TicketSupplierStock',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.ticketimagetype'} />,
  //         icon: <LibraryBooks />,
  //         type: 'item',
  //         link: '/dashboard/Attractions/ImageType',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.tickettag'} />,
  //         icon: <DonutSmall />,
  //         type: 'item',
  //         link: '/dashboard/Attractions/TicketTag',
  //       },
  //       {
  //         name: <LanguageConfig id={'Ticket Price Comments'} />,
  //         icon: <AddComment />,
  //         type: 'item',
  //         link: '/dashboard/Attractions/TicketPriceComments',
  //       },
  //       {
  //         name: <LanguageConfig id={'Ticket Price Plan'} />,
  //         icon: <AttachMoney />,
  //         type: 'item',
  //         link: '/dashboard/Attractions/TicketPricePlan',
  //       },
  //       {
  //         name: <LanguageConfig id={'menus.ticketplan'} />,
  //         icon: <Note />,
  //         type: 'item',
  //         link: '/dashboard/Attractions/TicketPlan',
  //       },
  //       {
  //         name: <LanguageConfig id={'Ticket stock'} />,
  //         icon: <Note />,
  //         type: 'item',
  //         link: '/dashboard/Attractions/TicketStock',
  //       },
  //       // {
  //       //   name: <LanguageConfig id={'Ledger Journals'} />,
  //       //   icon: <Settings style={{ color: 'red' }} />,
  //       //   type: 'item',
  //       //   link: '/dashboard/Setting/LedgerJournals',
  //       // },
  //       // {
  //       //   name: <LanguageConfig id={'Ledgers'} />,
  //       //   icon: <Settings style={{ color: 'red' }} />,
  //       //   type: 'item',
  //       //   link: '/dashboard/Setting/Ledgers',
  //       // },
  //       // {
  //       //   name: <LanguageConfig id={'Mode Of Payment'} />,
  //       //   icon: <Settings style={{ color: 'red' }} />,
  //       //   type: 'item',
  //       //   link: '/dashboard/Setting/ModeOfPayment',
  //       // },
  //       // {
  //       //   name: <LanguageConfig id={'Purchase Invoice'} />,
  //       //   icon: <Settings style={{ color: 'red' }} />,
  //       //   type: 'item',
  //       //   link: '/dashboard/Setting/PurchaseInvoice',
  //       // },
  //       // {
  //       //   name: <LanguageConfig id={'Sales Report'} />,
  //       //   icon: <Settings style={{ color: 'blue' }} />,
  //       //   type: 'item',
  //       //   link: '/dashboard/Report/SalesReport',
  //       // },
  //       // {
  //       //   name: <LanguageConfig id={'Ledger Balance'} />,
  //       //   icon: <Settings style={{ color: 'blue' }} />,
  //       //   type: 'item',
  //       //   link: '/dashboard/Report/LedgerBalance',
  //       // },
  //       // {
  //       //   name: <LanguageConfig id={'Ledger Cummulative'} />,
  //       //   icon: <Settings style={{ color: 'blue' }} />,
  //       //   type: 'item',
  //       //   link: '/dashboard/Report/LedgerCummulative',
  //       // },
  //       // {
  //       //   name: <LanguageConfig id={'Ledger Cummulative Summary'} />,
  //       //   icon: <Settings style={{ color: 'blue' }} />,
  //       //   type: 'item',
  //       //   link: '/dashboard/Report/LedgerCummulativeSummary',
  //       // },
  //     ],
  //   },
  //   // {
  //   //   name: '',
  //   //   type: 'section',
  //   //   children: [
  //   //     {
  //   //       name: <LanguageConfig id={'Ledgers'} />,
  //   //       icon: <AccountBalanceWallet />,
  //   //       type: 'item',
  //   //       link: '/dashboard/Accounts/Ledgers/',
  //   //     },
  //   //     {
  //   //       name: <LanguageConfig id={'Ledgers Group'} />,
  //   //       icon: <GroupWork />,
  //   //       type: 'item',
  //   //       link: '/dashboard/Accounts/LedgerGroup/',
  //   //     },
  //   //     {
  //   //       name: <LanguageConfig id={'Ledgers Journal'} />,
  //   //       icon: <LibraryBooks />,
  //   //       type: 'item',
  //   //       link: '/dashboard/Accounts/LedgerJournal/',
  //   //     },
  //   //     {
  //   //       name: <LanguageConfig id={'Ledgers Expense'} />,
  //   //       icon: <CollectionsBookmark />,
  //   //       type: 'item',
  //   //       link: '/dashboard/Accounts/LedgerExpense/',
  //   //     },
  //   //     {
  //   //       name: <LanguageConfig id={'Purchase Invoice'} />,
  //   //       icon: <Receipt />,
  //   //       type: 'item',
  //   //       link: '/dashboard/Accounts/PurchaseInvoice/',
  //   //     },
  //   //     {
  //   //       name: <LanguageConfig id={'Bank Master'} />,
  //   //       icon: <AccountBalance />,
  //   //       type: 'item',
  //   //       link: '/dashboard/Accounts/BankMaster/',
  //   //     },
  //   //     {
  //   //       name: <LanguageConfig id={'Mode Of Pay'} />,
  //   //       icon: <Payment />,
  //   //       type: 'item',
  //   //       link: '/dashboard/Accounts/ModeOfPay/',
  //   //     },
  //   //     {
  //   //       name: <LanguageConfig id={'Curreny Margin'} />,
  //   //       icon: <Public />,
  //   //       type: 'item',
  //   //       link: '/dashboard/Currency/UpdateMargin/',
  //   //     },
  //   //   ]
  //   // }
  // ];
  return (
    <PerfectScrollbar className={classes.perfectScrollbarSidebar}>
      <CmtVertical menuItems={menus} />
    </PerfectScrollbar>
  );
};

export default SideBar;
