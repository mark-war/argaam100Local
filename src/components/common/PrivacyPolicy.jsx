import React from "react";
import { useSelector } from "react-redux";
import Modal from "react-modal";
import useScrollbarVisibility from "../../hooks/useScrollbarVisibility";
import { strings } from "../../utils/constants/localizedStrings";


const PrivacyEn = () => {
  return (
    <>
      <p>
        Argaam is aware of the importance of privacy and protection of personal
        data at the digital era and is therefore committed to the protection of
        the privacy of the users of ARGAAM services, while browsing or using our
        websites and using our services.
        <br />
        <br />
        This <b>Privacy Policy</b> will describe how Argaam ensures an adequate
        level of protection of personal data (i.e. any information relating to
        natural persons who can be identified, directly or indirectly, in
        particular by reference to an identifier such as a name, an
        identification number, location data, an online identifier or to one or
        more factors specific to that natural person; hereinafter "
        <b>Personal Data</b>").
        <br />
        <br />
        This Privacy Policy applies to all services offered by Argaam Investment
        Company on its websites, digital applications, and other digital
        properties ("ARGAAM Services").
        <br />
        <br />
        Further privacy notices, highlighting certain uses we wish to make of
        your Personal Data, together with the ability to opt in or out of
        selected uses may also be provided on a case-by-case basis, including
        for new or other services that might have separate privacy policy.{" "}
      </p>

      <p>Policy key definitions:</p>
      <ul>
        <li>"I", "our", "us", or "we" refer to Argaam Investment Company.</li>
        <li>"You", "the user" refer to the person(s) using ARGAAM Services.</li>
      </ul>

      <h3>WHY DO WE COLLECT AND PROCESS YOUR PERSONAL DATA?</h3>
      <p>
        We collect and process your Personal Data for the following purposes:
      </p>
      <ul>
        <li>
          To provide you with the services you request from us; allow you the
          use of online forms, surveys, including ARGAAM Services that do not
          require any form of registration; allow you to sign up for certain
          services, such as newsletters, information feeds, SMS updates or to
          create an account in which case, we will ask for Personal Data, such
          as your name, email address, or telephone number.
        </li>
        <li>
          To allow you to share information; allow you to take full advantage of
          the sharing features that we offer such as the participation in viewer
          forums and discussion boards, allow you to create a publicly visible
          ARGAAM Profile, which may – if you choose include your name and photo;
          combine Personal Data from one service with information from other
          ARGAAM Services to make it easier to share things with people you
          know.
        </li>

        <li>
          To maintain and improve our Services; understand how you use ARGAAM
          Services and implement other functionalities; develop new services and
          offers.
        </li>
        <li>
          {" "}
          To tailor the services to your needs; provide you with tailored
          content and a better user experience.
        </li>
        <li>
          {" "}
          To carry out payment transactions; store transaction history; make
          sure that your subscription to our Services has been paid; comply with
          legal or regulatory obligation in this respect.
        </li>
        <li>
          To communicate with you; to allow you to contact Argaam; keep record
          of our exchanges; help solve any issues you might be facing; send you
          promotional offers and direct marketing; inform you about our
          services, such as letting you know about upcoming program information
          or improvements to our digital properties.
        </li>
        <li>
          To create and maintain a trusted and safer environment; investigating,
          detecting, preventing, or reporting fraud, misrepresentations,
          security breaches or incidents, or other potentially prohibited or
          illegal activities; protecting our sellers’, or your rights or
          property, or the security or integrity of our Services; enforcing our
          Terms of Service or other applicable agreements or policies; verifying
          your identity.
        </li>
        <li>
          {" "}
          Complying with any applicable laws or regulations, or in response to
          lawful requests for information from the government or through legal
          process; fulfilling any other purpose disclosed to you in connection
          with our Services; contacting you to resolve disputes and provide
          assistance with our services.
        </li>
      </ul>

      <h3>ON WHAT LEGAL BASIS DO WE PROCESS YOUR PERSONAL DATA?</h3>
      <p>
        Depending on the data processing at stake, we will generally process
        your Personal Data on either one of the following bases:{" "}
      </p>
      <ul>
        <li>
          <b>Your prior consent:</b> for instance, when we offer you to register
          to our services and create an account, subscribe to our newsletter or
          marketing emails or when we ask to follow any relevant procedure to
          allow you to either clearly accept or refuse the envisaged data
          processing; if you accept, you will be entitled to withdraw your
          consent at any time.{" "}
        </li>
        <li>
          <b>A contractual relationship:</b> in such case, the processing of
          your Personal Data is generally necessary for the execution or the
          performance of the contract; this means that if you do not wish us to
          process your Personal Data in that context, we may refuse to enter
          into such contract with you.{" "}
        </li>
        <li>
          <b>A legitimate interest:</b> in the sense of data protection law: for
          instance, when we implement certain monitoring or tracking devices
          implying the processing of Personal Data to detect and prevent online
          fraud and intrusions. For instance, when you visit and access to our
          websites, even without creating an account, and make use of the
          services offered by Argaam and/or the digital properties of Argaam
          Investment Company, you acknowledge that we may implement legitimate
          data processing as described in this Privacy Policy. If you do not
          agree to the following policy you may wish to cease using our
          websites.
        </li>
      </ul>

      <h3>WHO MAY ACCESS YOUR DATA?</h3>
      <p>
        For the purposes described above, We shall grant access to your Personal
        Data to authorized Argaam employees and members of the Company who have
        a need-to-know in order to process it for us, and who are subject to
        strict contractual confidentiality obligations and may be disciplined or
        terminated if they fail to meet these obligations.
        <br />
        <br />
        In addition, we may need to transfer or allow access to the following
        authorized third-parties:
      </p>
      <ul>
        <li>
          <b>Suppliers and services providers</b> we engage with to process
          Personal Data or perform ARGAAM Services on our behalf (based on our
          instructions and in compliance with our Privacy Policy and other
          appropriate confidentiality and security measures);
        </li>
        <li>
          <b>Successors in title to our business</b> (or who are in meaningful
          discussions about such a possibility with the (prospective) new owners
          of the business or company); in this respect, if ownership of all or
          substantially all of our business changes or undertakes a corporate
          reorganization or any other action or transfer between Argaam, you
          acknowledge that we may need to transfer your Personal Data to the
          relevant third party (or its advisors) as part of any due diligence
          process for the purpose of analyzing any proposed sale to, or
          re-organization by the new owner. We may also need to transfer your
          Personal Data to that re-organized entity or third party after the
          sale or reorganization for them to use for the same purposes as set
          out in this policy;
        </li>
        <li>
          <b>Our media representatives;</b>
        </li>
        <li>
          <b>
            Legal advisers, witnesses, experts and judicial and quasi-judicial
            authorities
          </b>{" "}
          in order to protect us against harm to the rights, property or safety
          of Argaam Investment Company, our users or the public as required or
          permitted by law, and other third-parties to enforce applicable Terms
          of Service, including investigation of potential violations;
        </li>
        <li>
          {" "}
          <b>Administrative or judicial authorities</b> in order to meet the
          requirements of any applicable law, regulation, legal process or
          enforceable governmental request.
        </li>
      </ul>
      <p>
        We may also aggregate, anonymize data publicly and to other authorized
        third-parties and partners – like advertisers or connected sites. For
        example, we may share information publicly to show trends about the
        general use of our services.
      </p>

      <h3>WHERE MAY YOUR DATA BE STORED OR TRANSFERRED?</h3>
      <p>
        Argaam Investment Company is a regional company with partners and
        subcontractors located in several countries around the region.
        <br />
        <br />
        For that reason, We may need to transfer your Personal Data to other
        jurisdictions, in countries whose data protection laws may be of a lower
        standard than those in your country. For instance, We may process your
        Personal Data on a server located outside the country where you live and
        for this purpose transfer your Personal Data out of your country of
        residence.
        <br />
        <br />
        In order to ensure an adequate and consistent level of protection of
        your Personal Data, We will continuously implement appropriate
        safeguards to protect your Personal data as set out in this Privacy
        Policy.
        <br />
        <br />
        Contact us for further information.
     
        <a href="mailto:charts@argaam.com">charts@argaam.com</a>
      </p>

      <h3>HOW DO WE ENSURE THE SECURITY OF YOUR PERSONAL DATA?</h3>
      <p>
        We maintain appropriate physical, electronic, technical, organizational
        procedural safeguards and security measures, including governance
        models, to protect your Personal Data in accordance with data protection
        law against unauthorized access, use, alteration, disclosure or
        destruction of Personal Data.
        <br />
        <br />
        Please note however that no data transmission over the Internet or
        website can be guaranteed to be secure from intrusion. In addition, you
        should also take appropriate measures to safeguard your personal data,
        in particular by keeping your password secure and confidential. If you
        know or have reason to believe that your account credentials have been
        lost, stolen, misappropriated, or otherwise compromised or in case of
        any actual or suspected unauthorized use of your account, feel free to
        contact us.
        <br />
        <br />
        If we know or have reason to believe that your Personal Data were
        compromised, we will immediately notify affected users of a breach if
        such one happens in accordance with applicable laws.
      </p>

      <h3>FOR HOW LONG DO WE STORE YOUR PERSONAL DATA? </h3>
      <p>
        We will retain your Personal Data as long as your account is active or
        otherwise for as long as is necessary for the purpose for which we have
        initially collected it. This duration can be up to 10 years. Our
        retention periods are based on business needs and your information that
        is no longer needed is either irreversibly anonymized or destroyed.
        <br />
        <br />
        We aim to maintain our services in a manner that protects information
        from accidental or malicious destruction. Because of this, after
        information is deleted from our services, we may not immediately delete
        residual copies from our active servers and may not remove information
        from our backup systems.
        <br />
        <br />
        We may also retain your Personal Data for longer periods if necessary to
        comply with our legal obligations or to protect our legitimate
        interests.
      </p>

      <h3>HOW TO ACCESS, UPDATE AND DELETE YOUR PERSONAL DATA?</h3>
      <p>
        In accordance with data protection law you are entitled to exercise the
        following rights:{" "}
      </p>
      <ul>
        <li>
          <b>Right to obtain access to your Personal Data,</b>in which case we
          may provide you a copy of such data, unless it is made available to
          you directly, for instance within your personal account;
        </li>
        <li>
          <b>Right to rectify your Personal Data,</b>should your data be
          inaccurate or obsolete; in this respect, it is important that the
          Personal Data we hold about you is accurate and current. Please keep
          us informed if your Personal Data changes during the period for which
          we hold your data;
        </li>
        <li>
          <b>Right to withdraw consent,</b> where the processing relies on your
          prior consent and to withdraw your consent to all marketing
          processing;
        </li>
        <li>
          <b>Right to object to the processing of your Personal Data, </b>where
          the processing relies on our legitimate interest, insofar as your
          particular situation justifies so;
        </li>
        <li>
          <b>Right to erasure </b>of your personal data;
        </li>
        <li>
          <b>Right to restrict </b>the processing of your Personal Data;
        </li>
        <li>
          <b>Right to receive your Personal Data for transmission </b>to a
          third-party or to obtain the transfer of your Personal Data to a
          third-party of your choice where technically possible;
        </li>
        <li>
          <b>
            Right to lodge a complaint with a competent data protection
            authority{" "}
          </b>
          if you consider the processing of your Personal Data to infringe data
          protection law.
        </li>
      </ul>
      <p>Please note that:</p>
      <ul>
        <li>
          We may need to Right to obtain access to your Personal Data we can act
          on your request;{" "}
        </li>
        <li>
          Because the exercise of these rights is subject to certain legal
          conditions and limitations, we may have to decline your request if
          those conditions are not fulfilled or if legal limitations apply;
        </li>
        <li>
          We may reject requests that are unreasonably repetitive, require
          disproportionate technical effort (for example, developing a new
          system or fundamentally changing an existing practice), or create a
          risk on the privacy of others.
        </li>
      </ul>
      <p>
        In any case, we will seek to deal promptly with your request, and in any
        event within one month (subject to any extensions to which we are
        lawfully entitled). If we refuse your request, we will tell you the
        reasons for doing so.{" "}
      </p>
      <h3>HOW DO WE USE COOKIES? </h3>
      <p>
        A cookie is a small piece of information sent by a web server to a web
        browser, which enables the server to collect information from the
        browser. Most browsers allow you to turn off cookies. If you want to
        know how to do this please look at the help menu on your browser.
        However, some cookies are essential for us to use in order to provide
        you with ARGAAM Services you have requested and switching off cookies
        will restrict your use of our digital properties.
        <br />
        <br />
        For instance, We store and use cookies and similar technology:{" "}
      </p>

      <ul>
        <li>
          To improve your user experience and the overall quality of ARGAAM
          Services ;{" "}
        </li>
        <li>
          {" "}
          To identify you when you visit our digital properties websites;{" "}
        </li>
        <li>
          To follow and study your browsing / navigation patterns through the
          website, build up your demographic profile and provide you with the
          most relevant service to your taste (more convenient recommendations
          and related shows to what you like);
        </li>
        <li>
          {" "}
          To deliver the proper content allowed in each geographical region
          based on intellectual property rights licensed to us;
        </li>
      </ul>
      <p>
        We also share information about your use of our site with our social
        media, advertising and analytics partners who may combine it with other
        information that you have provided them or that they have collected from
        your use of their services. You consent to our cookies if you use ARGAAM
        Services.{" "}
      </p>
      <h3>HOW DOES THIS POLICY WORK WITH THIRD PARTY DATA PROCESSING? </h3>
      <p>
        ARGAAM Services may be provided through and/or utilize features (such as
        voice controls) operated by third party platforms, or contain links to
        sites operated by third parties whose policies regarding the handling of
        Personal Data may differ from ours.
        <br />
        <br />
        For example:
      </p>

      <ul>
        <li>
          You may be able to access ARGAAM Services through platforms such as
          gaming systems, smart TVs, mobile devices, set top boxes and a number
          of other Internet connected devices. In addition, you may encounter
          third party applications that interact with ARGAAM Services. These
          third-parties have separate and independent privacy or Personal Data
          policies and terms of use.
        </li>
        <li>
          Our digital properties may contain links to other websites which are
          outside our control and are not covered by this Privacy Policy. If you
          access other sites using the links provided, the operators of these
          sites may collect information from you which will be used by them in
          accordance with their privacy policies, which may differ from ours.
        </li>
      </ul>
      <p>
        We invite you to consult such policies and terms if you want to inquire
        about the processing of your Personal Data by such third-parties.{" "}
      </p>
      <h3>HOW MAY THIS PRIVACY POLICY BE UPDATED? </h3>
      <p>
        We may update this Privacy Policy from time to time in response to
        changing legal, regulatory or operational requirements. Any changes of
        this Privacy Policy will be published on this page. When these changes
        are material, we may provide you specific notice of any such changes
        (including when they will take effect) in accordance with the law.
        <br />
        <br />
        Where applicable, we will ensure that you have had the possibility to
        accept those changes so as to allow you to continue using our services
        or to refuse in which case, you will be entitled to cancel your use of
        ARGAAM Services.
      </p>
    </>
  );
};

const PrivacyAr = () => {
  return (
   <>
   <p> فهي ملتزمة بحماية خصوصية مستخدمي خدمات شركة أرقام أثناء تصفح أو استخدام مواقعنا الإلكترونية واستخدام خدماتنا.<br />ستوضح سياسة الخصوصية كيف تضمن شركة أرقام الاستثمارية حماية البيانات الشخصية على مستوى متقدم (مثلا أي معلومات تتعلق بالأشخاص الطبيعيين الذين يمكن تحديد هوياتهم، بشكل مباشر أو غير مباشر، خاصة بالرجوع إلى سمة تعريف مثل الاسم أو رقم التعريف أو معلومات عن الموقع أو معرف الإنترنت، أو واحدة أو أكثر من العوامل المحددة لهذا الشخص الطبيعي، المشار اليها فيما بعد&nbsp; بـ "<strong>البيانات الشخصية</strong>").<br />وبشكل محدد، ستوضح سياسة الخصوصية هذه ما يلي:</p>


<ul>
    <li>لماذا نقوم بجمع ومعالجة بياناتك الشخصية وكيف نستخدمها،</li>
    <li>على أي أساس قانوني نقوم بمعالجة بياناتك الشخصية،</li>
    <li>من يمكنه الولوج إلى بياناتك الشخصية،</li>
    <li>أين يمكن تخزين أو نقل بياناتك الشخصية،</li>
    <li>كيف نحمي أمن بياناتك الشخصية،</li>
    <li>إلى متى نقوم بالاحتفاظ ببياناتك الشخصية،</li>
    <li>ما الحق الذي يمكن أن تمارسه فيما يتعلق ببياناتك الشخصية بموجب القوانين واللوائح الحالية،</li>
    <li>كيفية الاتصال بنا.</li>
    <li>كيفية الاتصال بنا.</li>
</ul>

<p>تنطبق سياسة الخصوصية على جميع الخدمات التي تعرضها شركة أرقام الاستثمارية على مواقعها الإلكترونية، وتطبيقاتها الرقمية وغيرها من الخصائص الرقمية.

    <br />
    <br />
    ويمكن أيضا إرسال إشعارات أخرى تسلط الضوء على استخدامات معينة نرغب إجراءها على بياناتك الشخصية بالإضافة إلى إمكانية الاشتراك أو إلغاء استخدامات محددة على أساس كل حالة على حدة، بما في ذلك الخدمات الجديدة أو خدمات أخرى قد يكون لها سياسة خصوصية خاصة بها.

<br />
<br />
تعريفات رئيسية لسياسة الخصوصية </p>

<ul>
    <li>"أنا"، "لنا"، أو "نحن" تشير إلى شركة أرقام الاستثمارية.</li>
    <li>"أنت"، أو "المستخدم" تشير إلى الشخص (الأشخاص) الذي يستخدم خدمات شركة أرقام.</li>
</ul>


<h3>ماذا نقوم بجمع ومعالجة بياناتك الشخصية؟</h3>
<p>نقوم بجمع ومعالجة بياناتك الشخصية للأغراض التالية :</p>
<ul>
    <li> - للسماح لك باستخدام النماذج عبر الإنترنت والاستطلاعات، بما في ذلك خدمات شركة أرقام التي لا تتطلب أي شكل من أشكال التسجيل، وللسماح لك بالتسجيل في خدمات معينة، كالنشرات الإخبارية أو موجز المعلومات أو تحديثات الرسائل النصية القصيرة أو إنشاء حساب. وفي هذه الحالة سوف نطلب منك بيانات شخصية كالاسم والعنوان والبريد الإلكتروني ورقم الهاتف</li>
        <li> للسماح لك من الاستفادة بشكل تام من مميزات المشاركة التي نقدمها مثل المشاركة في منتديات المشاهدين وهيئات المناقشة والتفاعل مع تطبيقات الشاشة الثانية للمشاهدة المشتركة، وللسماح بإنشاء حساب تعريفي يمكن رؤيته من قبل العامة على مواقع أرقام، ويشمل اسمك وصورتك، ولضم معلوماتك الشخصية التي حصلنا عليها من خلال إحدى الخدمات مع المعلومات التي جمعناها من خدمات أخرى مقدمة من أرقام لتسهيل مشاركة بعض الأشياء مع الأشخاص الذين تعرفهم</li>
        
        <li> لفهم كيفية استخدامك لخدمات أرقام وتطبيق وظائف أخرى، ولتطوير خدمات وعروض جديدة </li>      
                <li>  لتزويدك بمحتوى مخصص، والسماح لنا بمعرفتك بشكل أفضل لمنحك المزيد من الخدمات التي تطلبها المزيد من العروض ولمنحك تجربة أفضل كمستخدم </li>       
                <li>  لتخزين سجل المعاملات، والتأكد من دفع رسوم اشتراكك في خدماتنا، والامتثال للالتزام القانوني أو التنظيمي بهذا الصدد </li>       
            <li> للسماح لك بالاتصال بشركة أرقام الاستثمارية، والاحتفاظ بسجل محادثاتنا، ولمساعدتك على حل أية مسائل قد تواجهها، ولإرسال العروض الترويجية والتسويق المباشر، ولإخبارك بخدماتنا مثل تزويدك بمعلومات عن برامج مقبلة أو إضافة تعديلات على ممتلكاتنا الرقمية.</li>    
        <li> التحقيق أو كشف أو منع أو الإبلاغ عن الاحتيال أو التحريفات أو الانتهاكات أو الحوادث الأمنية أو غيرها من الأنشطة المحظورة أو غير القانونية المحتملة، ولحماية بائعينا وحقوقك وأمان وسلامة خدماتنا، ولتطبيق شروط الخدمة الخاصة بنا أو غيرها من الاتفاقيات أو السياسات، وللتحقق من هويتك </li>       
        <li>  أو الاستجابة لطلبات قانونية للحصول على معلومات من الحكومة أو من خلال الإجراءات القانونية، ولتحقيق أي غرض آخر يتم الإفصاح عنه لك فيما يتعلق بخدماتنا، والاتصال بك لحل النزاعات وتقديم المساعدة في خدماتنا</li>
</ul>

<h3>على أي أساس قانوني نقوم بمعالجة بياناتك الشخصية؟</h3>
<p>بناء على نوع البيانات التي سيتم معالجتها، سنقوم بمعالجة بياناتك الشخصية على أحد الأسس التالية: </p>
<ul>
    <li><b>موافقتك المسبقة:</b>  على سبيل المثال، عندما نعرض عليك التسجيل في خدماتنا وإنشاء حساب، أو الاشتراك في رسائلنا الإخبارية أو البريد الإلكتروني التسويقي أو نطلب منك اتباع أي إجراء ذي صلة يتيح لك قبول أو رفض معالجة البيانات، في حال قبولك، يحق لك سحب موافقتك في أي وقت. ومع ذلك، وفي بعض الحالات، إن اختيارك لعدم الإفصاح عن بياناتك الشخصية أو سحب موافقتك قد يحد استخدامك لخدماتنا أو ميزاتنا أو عروضنا. فمثلا قد لا يكون بإمكانك الدخول على أجزاء معينة على مواقعنا الإلكترونية والرد على استفساراتك دون تقديم المعلومات ذات الصلة.  </li>
        <li><b>العلاقات التعاقدية:</b> إن معالجة بياناتك الشخصية ضروري لتنفيذ أو إنجاز العقد، ما يعني أنه في حال عدم رغبتك بقيامنا بمعالجة بياناتك الشخصية في هذا السياق، قد نرفض الدخول في تعاقدات معك.  </li>  
     
 
</ul>

<h3>من يمكنه الوصول إلى بياناتك الشخصية:</h3>
<p>للأغراض الموضحة أعلاه، سنمنح إمكانية الوصول إلى بياناتك الشخصية لموظفي شركة أرقام الاستثمارية المرخصين وأعضاء شركة أرقام الاستثمارية الذين يحتاجون إلى معرفة تلك المعلومات من أجل معالجتها لمصلحة الطرفين، والذين يخضعون لالتزامات تعاقدية سرية صارمة، وهم على دراية بأنهم قد يواجهون إجراءات صارمة أو ربما قد يتم إنهاء التعاقد معهم في حال الإخلال بهذه الالتزامات. وقد نحتاج إلى نقل أو السماح لطرف ثالث معتمد بالوصول إلى بياناتك الشخصية وهم: 
    <br /> <br />
     <strong>الموردين ومزودي الخدمات</strong> الذين نتعامل معهم لمعالجة البيانات الشخصية أو تنفيذ خدمات شركة أرقام بالنيابة عنا (بناءً على تعليماتنا وتبعا لسياسة الخصوصية الخاصة بنا وغيرها من التدابير الأمنية والسرية المناسبة)،

     <br /><br />

     <strong>الخلفاء في ملكية الشركة او أعمالنا</strong> (أو في مناقشات جدية حول مثل هذا الاحتمال مع المالكين الجدد (المحتملين) للأعمال أو الشركة)، في هذا الصدد إذا تغيرت ملكية الشركة أو أعمالنا أو جزء كبير منها أو تمت عملية إعادة تنظيم الشركة أو أي إجراء آخر أو تنقلات بين كيانات شركة أرقام الاستثمارية، فإنك تقر وتقبل بأننا قد نحتاج إلى نقل بياناتك الشخصية إلى الطرف الثالث ذي الصلة كجزء من أي عملية لغرض تحليل إي عرض بيع  مقترح أو إعادة تنظيم للمالك الجديد. وقد نحتاج إلى نقل بياناتك إلى تلك الجهة المعاد تنظيمها أو الطرف الثالث بعد عملية البيع أو إعادة تنظيم بياناتك الشخصية لاستخدامها لنفس الأغراض الموضحة في سياسة الخصوصية هذه،</p>

<ul>
    <li><b>ممثلي وكلائنا الإعلاميين</b> </li>
    <li><b>المستشارون القانونيون والشهود والخبراء والسلطات القضائية وشبه القضائية</b> من أجل حماية المجموعة من أي أذى لحقوقها وممتلكاتها أو سلامتها، وحماية مستخدمينا أو الجمهور وأي طرف ثالث على النحو المطلوب أو المسموح به بموجب القانون، وفرض الشروط اللازمة للخدماتنا، بما في ذلك التحقيق في الانتهاكات المحتملة،</li>
    <li><b>السلطات الإدارية أو القضائية </b> من أجل تلبية متطلبات أي قانون ساري المفعول ونظام وإجراء قانوني أو طلب حكومي واجب النفاذ .</li>

</ul>
<p>قد نقوم أيضا بتجميع بيانات مجهولة للعموم ولطرف ثالث وشركاء معتمدين آخرين مثل شركات الإعلان أو المواقع المتصلة. على سبيل المثال قد نشارك المعلومات للعامة لعرض مؤشرات حول الاستخدام العام لخدماتنا.</p>


<h3>أين يمكن تخزين أو نقل بياناتك الشخصية؟</h3>

<p>شركة أرقام الاستثمارية هي شركة ذات أنشطة في عدة عواصم حول المنطقة وتعمل مع شركاء ومقاولين موجودين في عدة بلدان. لهذا السبب، قد نحتاج إلى نقل بياناتك إلى بلدان أخرى، بما في ذلك النطاق خارج منطقة مجلس التعاون الخليجي، وإلى بلدان قد تكون قوانين حماية البيانات فيها أقل من تلك الموجودة في بلدك.</p>

<h3>كيف نحمي أمن بياناتك الشخصية؟</h3>

<p>نحن نتبع إجراءات أمنية مادية وإلكترونية وتقنية وتدابيرأمنية وتنظيمية مناسبة، بما في ذلك نماذج الحوكمة لحماية بياناتك الشخصية وفقا لقانون حماية البيانات من الوصول غير المصرح به إلى البيانات الشخصية أو استخدامها أو تغييرها أو الإفصاح عنها أو إتلافها 

<br />
<br />
    يرجى الملاحظة أنه لا يمكن ضمان نقل أية بيانات عبر الإنترنت أو الموقع الإلكتروني من دون أي تدخل. وعليك اتخاذ الإجراءت المناسبة لحماية بياناتك الشخصية خاصة من خلال الحفاظ على كلمة المرور وسريتها. وإن كنت تعلم أو لديك شك بأن بيانات اعتماد حسابك قد ضاعت أو تمت سرقتها أو اختلست أو تعرضت لأية مخاطر أو في حال وجود أي استخدام غير مصرح، لا تتردد في الاتصال بنا 
<br />
<br />

إن كنا نعلم أو لدينا سبب للاعتقاد أن بياناتك الشخصية قد تعرضت للاختراق، سنقوم فورا بإبلاغ المستخدمين المتضررين من حدوث خرق وفقا للقوانين المعمول بها.</p>


<h3>ما هي مدة الاحتفاظ ببياناتك الشخصية؟</h3>

<p>سوف نحتفظ ببياناتك الشخصية ما دام حسابك نشطا، أو طالما كان ذلك ضروريا للغرض الذي تم جمع البيانات من أجله أساسا. مدة الاحتفاظ قد تصل إلى 10 سنوات. وتستند فترات الاحتفاظ لدينا على احتياجات أنشطتنا، والمعلومات الخاصة بك التي لم يعد هناك حاجة لها يتم تحويلها لمعلومات مجهولة بشكل قاطع أو تدميرها 
    <br />
    <br />
    نهدف إلى الحفاظ على خدماتنا بطريقة تحمي المعلومات من التدمير العرضي أو الضار. ولهذا بعد حذف المعلومات من خدماتنا، قد لا نقوم فورا بحذف النسخ المتبقية من خوادمنا النشطة وقد لا نزيل المعلومات من أنظمة النسخ الاحتياطي الخاصة بنا 
<br />
<br />
يجوز لنا أيضا الاحتفاظ ببياناتك لفترات أطول إذا لزم الأمر لتنفيذ التزاماتنا القانونية أو حماية مصالحنا.</p>


<h3>كيفية الوصول إلى وتحديث وحذف بياناتك الشخصية؟</h3>
<p>بموجب قانون حماية البيانات يحق لك ممارسة الحقوق التالية:

    <br />
    <br />
    <b>الوصول إلى بياناتك الشخصية،</b>  في هذه الحالة قد نوفر لك نسخة من هذه البيانات، إن لم يكن ذلك متاحا مباشرة، على سبيل المثال ضمن حسابك الشخصي، 

<br />
<br />
<b>الحق في تعديل بياناتك الشخصية،</b> إن كانت بياناتك غير دقيقة أو قديمة. من المهم أن تكون البيانات الشخصية التي نحتفظ بها عنك دقيقة وحديثة. يرجى إطلاعنا في حال حدث أي تغيير ببياناتك الشخصية.</p>



<ul>
    <li><b>الحق في سحب الموافقة،</b> تعتمد المعالجة على موافقتك المسبقة وسحب موافقتك على جميع عمليات التسويق.</li>
    <li><b>حق الاعتراض على معالجة بياناتك الشخصية،</b> حيث تعتمد المعالجة على مصالحنا المشروعة، بقدر ما يسمح له موقفك.</li>
    <li><b>الحق في مسح</b> البيانات الشخصية الخاصة بك،</li>
    <li><b>الحق في تقييد</b> معالجة البيانات الشخصية الخاصة بك،</li>
    <li><b>الحق في تلقي بياناتك الشخصية لإرسالها</b>  إلى طرف ثالث أو نقل بياناتك الشخصية لطرف ثالث من اختيارك إن كان ممكنا فنيا،</li>
    <li><b>حق تقديم شكوى لدى هيئة مختصة بحماية البيانات</b> إذا اعتبرت معالجة بياناتك الشخصية تنطوي على انتهاك لقانون حماية البيانات .</li>
  
</ul>

<p>يمكنك إرسال طلب بهذا الشأن في أي وقت عبر وسائل الاتصال المختلفة.

<br /><br />

ويرجى ملاحظة ما يلي :</p>


<ul>
    <li>قد نحتاج إلى التحقق من هويتك قبل أن نتصرف بناء على طلبك،</li>
    <li>بما أن ممارسة هذه الحقوق تخضع لشروط وقيود قانونية معينة، قد نضطر إلى رفض طلبك إذا لم يتم استيفاء هذه الشروط أو في حال وجود قيود قانونية،</li>
    <li>قد نقوم برفض طلبات متكررة بدون سبب معقول، وتتطلب جهدا فنيا (على سبيل المثال تطوير نظام جديد أو تغيير أساسي للممارسات الحالية)، أو تشكيل خطر على خصوصية الآخرين .</li>
</ul>


<p>
    سنسعى إلى التعامل بشكل فوري مع طلبك خلال شهر واحد (خاضعا لأية تمديدات نحققها قانونيا). إذا قمنا برفض طلبك، سوف نخبرك بالأسباب.
    <br /><br />
    <b>كيف نقوم باستخدام الكوكيز </b> (Cookies )؟
   <br /><br />
   ملفات الكوكيز هي جزء صغير من المعلومات يرسلها خادم الويب إلى متصفح الويب، ما يتيح للخادم جمع المعلومات من المتصفح. تسمح لك معظم المتصفحات بإيقاف تشغيل الكوكيز. إن كنت ترغب بمعرفة كيف يمكنك القيام بذلك، يرجى الاطلاع على قائمة المساعدة على المتصفح الخاص بك. ومع ذلك، إن بعض الكوكيز مهمة لنا حتى نتمكن من تزويدك بخدمات شركة أرقام التي طلبتها وسوف يؤدي إيقاف الكوكيز إلى الحد من استخدامك لملكياتنا الرقمية.
   <br />
   <br />
   على سبيل المثال، نحن نقوم بتخزين الكوكيز والتقنيات المشابهة ونستخدمها 
</p>



<ul>
    <li>لتحسين تجربتك كمستخدم وضمان الجودة الشاملة لخدمات شركة أرقام،</li>
    <li>للتعرف عليك عند زيارتك المواقع الالكترونية الرقمية الخاصة بنا،</li>
    <li>لمتابعة ودراسة أنماط التصفح والتنقل الخاصة بك في الموقع الإلكتروني، ولإنشاء ملفك الديموغرافي وتزويدك بالخدمة الأكثر ملاءمة لذوقك (توصيات أكثر ملاءمة وعروض ذات صلة لما يحلو لك)،</li>
    <li>لتحليل عادات استهلاك المحتوى (على سبيل المثال، البرامج التي يتم مشاهدتها وقراءة المحتوى والأجهزة المستخدمة إلخ.) ولتوفير وتخصيص وقياس وتحسين إعلاناتنا وتسويقنا،</li>
    <li>لتقديم المحتوى المناسب المسموح به في كل منطقة جغرافية استنادا إلى حقوق الملكية الفكرية المرخصة لنا،</li>
    <li>لمشاركة بعض البيانات لتوفير الإعلان المخصص بك وإرسال مواد التسويق والرسائل الإخبارية .</li>
</ul>



<p>
    كما نقوم بتبادل معلومات حول استخدامك لموقعنا مع وسائل التواصل الاجتماعية وشركائنا في الإعلانات والإحصاءات الذين قد يقومون بدمجها مع معلومات أخرى قدمتها لهم أو التي جمعوها من استخدامك لخدماتهم.
    <br />
    ة استخدامنا للكوكيز، يرجى الإتصال بنا كما هو موضح في قسم"<strong>كيفية الاتصال بنا</strong>" .
</p>

<h3>كيف تطبق سياسة الخصوصية هذه مع معالجة بيانات من طرف ثالث؟</h3>


<p>قد يتم توفير خدمات شركة أرقام من خلال و/أو الاستفادة من الميزات (مثل عناصر التحكم في الصوت) التي تشغلها منصات تابعة لطرف ثالث، أو تحتوي على روابط لمواقع يشغلها طرف ثالث قد تختلف سياساته المتعلقة بمعالجة البيانات الشخصية عن تلك السياسات الخاصة بنا .
فمثلا :</p>


<ul>
    <li>قد تتمكن من الوصول إلى خدمات شركة أرقام من خلال منصات مثل أنظمة الألعاب وأجهزة التلفزيون الذكية وأجهزة الجوال وأجهزة فك التشفير وعدد آخر من الأجهزة المتصلة بالإنترنت. بالإضافة إلى ذلك، قد تواجه تطبيقات تابعة لطرف ثالث تتفاعل مع خدمات شركة أرقام. هذا الطرف الثالث لديه خصوصية وسياسات بيانات الشخصية المنفصلة والمستقلة .</li>
    <li>قد تحتوي مواقعنا الرقمية على روابط لمواقع الكترونية أخرى خارجة عن سيطرتنا ولا تغطيها سياسة الخصوصية هذه. في حال قمت بالدخول إلى مواقع أخرى من خلال استخدام الروابط المتاحة، يمكن لمشغلي تلك المواقع جمع معلومات منك واستخدامها وفقا لسياسات الخصوصية الخاصة بهم، والتي قد تختلف عن تلك الخاصة بنا .</li>
</ul>


<p>ندعوك لمراجعة هذه السياسات والشروط إن كنت ترغب في الاستفسار عن معالجة بياناتك الشخصية من قبل طرف ثالث.
<br /><br />
الاتصال بنا
<br />
إن كان لديك أي استفسارات أخرى يرجى الاتصال بنا على البريد الإلكتروني التالي:

<a href="mailto:charts@argaam.com">charts@argaam.com</a>

</p>

<h3>كيف يمكن تحديث سياسة الخصوصية هذه؟</h3>


<p>
    قد نقوم بتحديث سياسة الخصوصية من وقت لآخر استجابة للمتطلبات القانونية أو التنظيمية أو التشغيلية. وسيتم نشر أي تغييرات في سياسة الخصوصية على هذه الصفحة. عندما تكون هذه التغييرات جوهرية، قد نرسل إخطارا يوضح التعديلات وموعد دخولها حيز التنفيذ وفقا للقانون.
    <br />
    <br />
    وإذا كانت التعديلات تتطلب معالجة بيانات جديدة تحتاج موافقتك المسبقة، سوف نطلب موافقتك على هذه المعالجة الجديدة وبإمكانك القبول أو الرفض.
</p>

   </>
  );
};

export default function PrivacyPolicy({ visible, onClose }) {
  const selectedLanguage = useSelector(
    (state) => state?.language?.currentLanguage
  );
  const Content = () =>
    selectedLanguage == "en" ? <PrivacyEn /> : <PrivacyAr />;

  useScrollbarVisibility(visible);
  return (
    <Modal
      isOpen={visible}
      ariaHideApp={false}      
      className={
        selectedLanguage == "en"
          ? "othermodal privacy_policyltr"
          : "othermodal privacy_policyrtl"
      }      
      style={{
        content: {
          zIndex: 99999,
          direction: selectedLanguage == "en" ? "ltr" : "rtl",
          background:'white',
          width: "70%",
        },
      }}
      onRequestClose={onClose}
    >
      {" "}
      <a href="#" className="closeIcon" onClick={onClose}></a>
      <h2>{strings.privacypolicy}</h2>
      <div className="contentpane"><Content /></div>
    </Modal>
  );
}
