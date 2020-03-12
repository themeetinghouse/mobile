
**Thoughts on Reducer Design**

What state needs to be shared between pages / components in the TMH app?

The most important state / component breakdown is separated along the lines of the main tab navigation
* Home
    - Current site
    - Current announcement list (digest? No, full) [load on init, reloadable]
    - Current event list (digest? No, full) [load on init, reloadable]
    - Current series (digest? No, full)
    * Announcement Detail
        - Announcement (full) [passed as prop] 
    * Event Detail
        - Event (full) [passed as prop] 
* Teaching
    - Current site
    - Current series
    - Sermon list (recent only)
    - Sermon list (popular only)
    - Highlight list (full list with infinite scroll)
    - Teachers list (full)
    * All Series
        - Current site
        - Series list (full list with infinite scroll, search)
    * All Sermons
        - Current site
        - Sermon list (recent, full list with infinite scroll, search)
    * More Popular
        - Current site
        - Sermon list (popular, full list with infinite scroll)
    * Highlights
        - Current site
        - Highlight list (full list with infinite scroll)
    * Series Landing
        - Series (full, includes sermons)
    * Sermon Landing
        - Series (full)
        - Sermon (full)
    * Notes
        - Notes
        - Comments
* Search
    - Search results
* More
    * Give (external link)
    * Volunteer
        - Form details
    * Connect
        - Form details
    * Staff Directory
        - Staff list (full list)
    * Home Church Finder
        - Current site
        - Home church list (full for current site)
* Other
    * Select Home Site 
        - Current site
    * Login / Signup
        - User
    * Site Selection
        - Current site


Reducers:
    - site
    - user