import { Activity } from "react";
import { PageHeaderProps } from "./types";

const PageHeader = (props: PageHeaderProps) => {

    const { title, description, cta } = props
    return (

        <div className="flex justify-between items-center">
            <div>

                <h1 className="text-[24px] font-bold text-black capitalize tracking-[-0.96px]">
                    {title}
                </h1>

                {/* {description && ( */}
                <Activity mode={!!description ? 'visible' : 'hidden'}>
                    <p className="text-sm font-medium text-gray-500 tracking-[-0.42px]">
                        {description}
                    </p>
                </Activity>
                {/* )} */}
            </div>

            {cta && cta}
        </div>
    );
};

export default PageHeader;