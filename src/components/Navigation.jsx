import { useState } from 'react';

export default function Navigation({ nav_data }) {
    const [isExpanded, setIsExpanded] = useState(true)
    const [selectedDropDownIndex, setSelectedDropDownIndex] = useState(null)

    return (
        <div id="navigation">
            <nav className="ieeevis-nav flex flex-start justify-between md:justify-start items-center">

                {/* vis logo and link to homepage */}
                <div className="logo--nav flex-none text-lg text-red-700 p-4 md:p-2 lg:p-4">
                    <a href="/">
                        <img src='/assets/vis2025_logo_white_RIESENRAD.svg' alt="VIS 2025" />
                    </a>
                </div>

                {/* menu button for phone mode */}
                <button
                    className={"md:hidden flex-end p-4  hamburger_menu font-display font-bold text-lg"}
                    onClick={() => { setIsExpanded(!isExpanded) }}
                >
                    Menu <i className="material-icons align-middle">menu</i>
                </button>

                <div className={`menu md:flex md:justify-end ${isExpanded ? "menu--expanded" : ""}`}>

                    {/* Blog item */}
                    {
                        nav_data.blog.display && <a className="nav-text-link" href={nav_data.blog.url}>
                            <button
                                className="menu_item {{is_active_class}} font-display text-lg md:text-base lg:text-lg px-8 md:px-2 lg:px-4 mx-0 lg:mx-2 py-4 md:py-6 border-b-2 border-primary-200 md:border-none"
                                tabIndex="0"
                                role="menuitem"
                            >
                                {nav_data.blog.text}
                            </button>
                        </a>
                    }

                    {/* Other menu items */}
                    {
                        nav_data.menu.map((nav, i) => (
                            <div key={`nav-div-${i}`}>
                                <button
                                    className={`menu_item {{is_active_class}} font-display text-lg md:text-base lg:text-lg px-8 md:px-2 lg:px-4 mx-0 lg:mx-2 py-4 md:py-6 border-b-2 border-primary-200 md:border-none ${selectedDropDownIndex === i ? "menu_item--focused" : ""}`}
                                    tabIndex="0"
                                    role="menuitem"
                                    key={`nav-item-${i}`}
                                    onClick={() => {
                                        if (selectedDropDownIndex === i) {
                                            setSelectedDropDownIndex(null)
                                        } else {
                                            setSelectedDropDownIndex(i)
                                        }
                                    }}
                                // v-bind:class="{ 'menu_item--focused': menu['{{ nav.dropdown }}'] }"
                                >
                                    <span className="whitespace-no-wrap">
                                        {nav.dropdown}
                                        <i className="material-icons align-middle">
                                            {selectedDropDownIndex === i ? 'arrow_drop_down' : 'arrow_right'}
                                        </i>
                                    </span>
                                </button>

                                <div
                                    className="dropdown"
                                    role="menu"
                                    aria-label="submenu"
                                    hidden={selectedDropDownIndex !== i}
                                // :aria-hidden="[isAriaHidden]"
                                // :aria-expanded="[isAriaExpanded]"
                                >
                                    {
                                        nav.sections.map((section, j) => (
                                            <div
                                                className="dropdown__section"
                                                key={`section-item-${j}`}
                                            >
                                                {
                                                    section.subsections.map((subsection, k) => (
                                                        <div
                                                            className="dropdown__subsection"
                                                            key={`subsection-item-${k}`}
                                                        >
                                                            {
                                                                subsection.heading_url ?
                                                                    <a
                                                                        className="dropdown__heading link--arrow"
                                                                        href={subsection.heading_url}
                                                                    >
                                                                        {subsection.heading}
                                                                    </a> :
                                                                    <span className="dropdown__heading">{subsection.heading}</span>
                                                            }

                                                            {
                                                                subsection.description && <p className="dropdown__description">{subsection.description}</p>
                                                            }

                                                            {
                                                                subsection.columns && <div className="sm:flex sm:flex-row flex-col">
                                                                    {
                                                                        subsection.columns.map((column, l) => (
                                                                            <ul className="flex-grow mt-4 md:mt-2" key={`column-item-${l}`}>
                                                                                {
                                                                                    column.heading && <li className="dropdown__heading text-gray-500">{column.heading}</li>
                                                                                }

                                                                                {
                                                                                    column.links.map((link, m) => (
                                                                                        <li
                                                                                            key={`link-item-${m}`}
                                                                                        >
                                                                                            {
                                                                                                link.url ?
                                                                                                    <a href={link.url}>{link.text}</a>
                                                                                                    :
                                                                                                    <a className="dropdown__disabled" title="Content forthcoming.">{link.text}</a>
                                                                                            }

                                                                                            {
                                                                                                link.is_external &&
                                                                                                <span><i className="material-icons align-middle text-secondary !text-sm">open_in_new</i></span>
                                                                                            }

                                                                                            {
                                                                                                link.is_new && <span className="bg-accent text-primary-500 text-sm mx-1 px-2 rounded-full">New</span>
                                                                                            }

                                                                                            {
                                                                                                link.description && <p className="dropdown__description">{link.description}</p>
                                                                                            }


                                                                                        </li>
                                                                                    ))
                                                                                }

                                                                            </ul>
                                                                        ))
                                                                    }
                                                                </div>
                                                            }

                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        ))
                                    }

                                </div>
                            </div>

                        ))
                    }


                </div>

            </nav>

            {/* The overlay when menu is expanded */}
            <div className="navigation__overlay"
                hidden={selectedDropDownIndex === null}>
            </div>

        </div>
    )
}
