import React from 'react';
import { Helmet } from 'react-helmet';
import './Title.css';

const Title = ({ subTitle, title, schemaType }) => {
  const itemType = schemaType || "https://schema.org/WebPage";

  return (
    <>
      {title && (
        <Helmet>
          <meta property="og:title" content={title} />
        </Helmet>
      )}

      <div className="title" itemScope itemType={itemType}>
        {subTitle && (
          <p className="subtitle" itemProp="alternativeHeadline">
            {subTitle}
          </p>
        )}
        {title && (
          <h2 itemProp="headline">
            {title}
          </h2>
        )}
      </div>
    </>
  );
};

export default Title;