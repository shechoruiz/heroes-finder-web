import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { SlashIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router";

interface Props {
  currentPage: string;
  breadcrumbs?: Breadcrumb[];
}

interface Breadcrumb {
  label: string;
  to: string;
}

export const CustomBreadcrumbs = ({ currentPage, breadcrumbs }: Props) => {
  return (
    <Breadcrumb className="my-4">
      <BreadcrumbList>
        {/* Home */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Inicio</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>
        {// Breadcrumbs
        breadcrumbs?.map((breadcrumb, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={breadcrumb.to}>{breadcrumb.label}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {/* Separator */}
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
          </React.Fragment>
        ))}
        {/* First level */}
        <BreadcrumbItem>
          <BreadcrumbLink className="font-bold text-black">
            {currentPage}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
