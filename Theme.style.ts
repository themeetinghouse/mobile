import Arrow from './assets/images/black/Arrow.png';
import ArrowWhite from './assets/images/white/Arrow.png';
import ArrowLeftWhite from './assets/images/white/Arrow-Left.png';
import UserWhite from './assets/images/white/User.png';
import NotesWhite from './assets/images/white/Notes.png';
import CalendarAddWhite from './assets/images/white/Calendar-Add.png';
import MapLocationWhite from './assets/images/white/Map-Location.png';
import AnnouncementWhite from './assets/images/white/Announcement.png';
import SearchWhite from './assets/images/white/Search.png';
import CheckWhite from './assets/images/white/Check.png';
import CloseCancelWhite from './assets/images/white/Close-Cancel.png';
import GiveWhite from './assets/images/white/Give.png';
import VolunteerWhite from './assets/images/white/Volunteer.png';
import ConnectWhite from './assets/images/white/Connect.png';
import StaffWhite from './assets/images/white/Staff.png';
import HomeChurchWhite from './assets/images/white/HomeChurch.png';
import TextOptionsWhite from './assets/images/white/TextOptions.png';
import NewWindowWhite from './assets/images/white/New-Window.png';
import UserWhiteLoggedIn from './assets/images/white/UserLoggedIn.png';
import SignOutWhite from './assets/images/white/SignOut.png';
import AccountWhite from './assets/images/white/Account.png';


export const Theme = {
    colors: {
        background: "#111111",
        header: "#111111",
        black: "#000000",
        gray1: "#111111",
        gray2: "#1a1a1a",
        gray3: "#54565a",
        gray4: "#646469",
        gray5: "#c8c8c8",
        gray6: "#efeff0",
        grey1: "#111111",
        grey2: "#1a1a1a",
        grey3: "#54565a",
        grey4: "#646469",
        grey5: "#c8c8c8",
        grey6: "#efeff0",
        white: "#ffffff",
        red: "#ff595a",
        yellow: "#FFC60B",
        transparent: "transparent",
    },
    fonts: {
        small: 12,
        smallMedium: 14,
        medium: 16,
        large: 24,
        extraLarge: 32,
        huge: 40,
        fontFamilyRegular: "Graphik-Regular-App",
        fontFamilyMedium: "Graphik-Medium-App",
        fontFamilyBold: "Graphik-Bold-App",
        fontFamilySemiBold: "Graphik-Semibold-App",
    },
    icons: {
        width: 24,
        height: 24,
        white: {
            account: AccountWhite,
            arrow: ArrowWhite,
            arrowLeft: ArrowLeftWhite,
            user: UserWhite,
            notes: NotesWhite,
            calendarAdd: CalendarAddWhite,
            mapLocation: MapLocationWhite,
            announcement: AnnouncementWhite,
            search: SearchWhite,
            check: CheckWhite,
            closeCancel: CloseCancelWhite,
            give: GiveWhite,
            volunteer: VolunteerWhite,
            connect: ConnectWhite,
            staff: StaffWhite,
            homeChurch: HomeChurchWhite,
            textOptions: TextOptionsWhite,
            newWindow: NewWindowWhite,
            userLoggedIn: UserWhiteLoggedIn,
            signOut: SignOutWhite,
        },
        black: {
            arrow: Arrow,
        }
    }
}

export const Style = {
    header: {
        backgroundColor: Theme.colors.header,
        color: Theme.colors.white,
        title: {
            color: Theme.colors.white,
            fontFamily: Theme.fonts.fontFamilyBold,
            textAlign: "center",
        },
        subtitle: {
            color: Theme.colors.white,
            fontFamily: Theme.fonts.fontFamilyMedium,
            fontSize: Theme.fonts.small,
        },
        buttonText: {
            color: Theme.colors.white,
            fontFamily: Theme.fonts.fontFamilyRegular,
            fontSize: Theme.fonts.medium,
        },
        linkText: {
            color: Theme.colors.white,
            fontFamily: Theme.fonts.fontFamilyRegular,
            fontSize: Theme.fonts.small,
        },
        linkTextInactive: {
            color: Theme.colors.white,
            fontFamily: Theme.fonts.fontFamilyRegular,
            fontSize: Theme.fonts.small,
            opacity: 0.24,
        }
    },
    categoryTitle: {
        color: Theme.colors.white,
        fontSize: Theme.fonts.large,
        fontFamily: Theme.fonts.fontFamilyBold,
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 16,
    }, 
    cardContainer: {
        borderColor: Theme.colors.gray2,
        borderTopWidth: 1
    },
    cardTitle: {
        color: Theme.colors.white,
        fontSize: Theme.fonts.medium,
        fontFamily: Theme.fonts.fontFamilyBold,
    },
    cardDescription: {
        color: Theme.colors.gray5,
        fontSize: Theme.fonts.medium,
        lineHeight: 24,
    },
    cardSubtext: {
        color: Theme.colors.white,
        fontSize: Theme.fonts.small,
    },
    icon: {
        width: Theme.icons.width,
        height: Theme.icons.height,
    },

    title: {
        color: Theme.colors.white,
        fontFamily: Theme.fonts.fontFamilyBold,
        fontSize: Theme.fonts.extraLarge,
        lineHeight: Theme.fonts.huge,
    },
    subtitle: {
        color: Theme.colors.white,
        fontFamily: Theme.fonts.fontFamilyBold,
        fontSize: Theme.fonts.medium,
    },
    body: {
        color: Theme.colors.gray5,
        fontFamily: Theme.fonts.fontFamilyRegular,
        fontSize: Theme.fonts.medium,
        lineHeight: Theme.fonts.large
    }
}

export default Theme;