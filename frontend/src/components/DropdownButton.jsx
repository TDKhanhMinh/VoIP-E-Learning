import Tippy from "@tippyjs/react/headless";
import Button from './Button';
function DropDownButton({ className, classNameBtn, children, items = [], ...passProps }) {
    return (
        <Tippy
            hideOnClick={false}
            delay={[0, 100]}
            offset={[12, 8]}
            interactive={true}
            trigger="click"
            placement="bottom-start"
            onClickOutside={(instance) => instance.hide()}
            render={attrs => (
                <div className="cursor-pointer content w-full min-w-[20px] mt-4 shadow-lg bg-white border border-gray-200" tabIndex={-1} {...attrs}>
                    <ul className={`menu-body h-auto py-3 flex flex-col ${className}`}>
                        {items.map((childrenItem, index) => (
                            <li key={index} className="text-green-700 w-[280px]">
                                <Button
                                    className={`block w-full bg-white font-bold text-base text-start text-black hover:bg-gray-200 uppercase ${classNameBtn}`}
                                    icon={childrenItem.icon}
                                    title={childrenItem.brand || childrenItem.title}
                                    to={childrenItem.to}
                                />
                            </li>
                        ))}
                    </ul>

                </div>
            )}
            {...passProps}
        >
            <div>
                {children}
            </div>
        </Tippy>
    );


}

export default DropDownButton;