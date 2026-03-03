import Button from './form/Button.vue';
import ButtonGroup from './form/ButtonGroup.vue';
import ButtonInfo from './form/ButtonInfo.vue';
import CheckBox from './form/CheckBox.vue';
import Col from './form/Col.vue';
import Divider from './form/Divider.vue';
import Form from './form/Form.vue';
import FormItem from './form/FormItem.vue';
import Input from './form/Input.vue';
import KDialog from './form/KDialog.vue';
import KOption from './form/KOption.vue';
import KRichText from './form/KRichText.vue';
import KStitok from './form/KStitok.vue';
import Aside from './form/layout/Aside.vue';
import Card from './form/layout/Card.vue';
import Container from './form/layout/Container.vue';
import Footer from './form/layout/Footer.vue';
import Header from './form/layout/Header.vue';
import Main from './form/layout/Main.vue';
import Row from './form/Row.vue';
import Select from './form/Select.vue';
import SvgCheckBox from './form/SvgCheckBox.vue';
import Wrapper from './form/Wrapper.vue';
import Table from './table/Table.vue';
import TableCell from './table/TableCell.vue';
import TableColumn from './table/TableColumn.vue';
import TableColumnHeader from './table/TableColumnHeader.vue';
import TableFrame from './table/TableFrame.vue';
import TableHeader from './table/TableHeader.vue';
import type { App } from 'vue';
import type { IdUpdateStatus } from './@types';
import KCheckBox3state from './form/KCheckBox3state.vue';
import KColorPicker from './form/KColorPicker.vue';
import KDateInterval from './form/KDateInterval.vue';
import KDatePicker from './form/KDatePicker.vue';
import KDrawer from './form/KDrawer.vue';
import KIcon from './form/KIcon.vue';
import KInputNumber from './form/KInputNumber.vue';
import KToolTip from './form/KToolTip.vue';
import KUpload from './form/KUpload.vue';
import KVirtualKeyboard from './form/KVirtualKeyboard/KVirtualKeyboard.vue';
import KCollapse from './form/layout/KCollapse.vue';
import KCollapseItem from './form/layout/KCollapseItem.vue';
import KTabPanel from './form/layout/KTabPanel.vue';
import KTabs from './form/layout/KTabs.vue';
import KMenu from './form/menu/KMenu.vue';
import KMenuItem from './form/menu/KMenuItem.vue';
import KSubMenu from './form/menu/KSubMenu.vue';
import TableColumnSelect from './table/TableColumnSelect.vue';

export default {
  install: (app: App): App => {
    // Layout
    app.component('KAside', Aside);
    app.component('KContainer', Container);
    app.component('KFooter', Footer);
    app.component('KHeader', Header);
    app.component('KMain', Main);
    app.component('KCard', Card);
    app.component('KCollapse', KCollapse);
    app.component('KCollapseItem', KCollapseItem);
    app.component('KTabPanel', KTabPanel);
    app.component('KTabs', KTabs);

    // Form
    app.component('KForm', Form);
    app.component('KFormItem', FormItem);
    app.component('KWrapper', Wrapper);
    app.component('KCol', Col);
    app.component('KRow', Row);
    app.component('KButton', Button);
    app.component('KButtonGroup', ButtonGroup);
    app.component('KButtonInfo', ButtonInfo);
    app.component('KInput', Input);
    app.component('KCheckBox', CheckBox);
    app.component('KCheckBox3state', KCheckBox3state);
    app.component('KColorPicker', KColorPicker);
    app.component('KDateInterval', KDateInterval);
    app.component('KDatePicker', KDatePicker);
    app.component('KDialog', KDialog);
    app.component('KDrawer', KDrawer);
    app.component('KIcon', KIcon);
    app.component('KInputNumber', KInputNumber);
    app.component('KOption', KOption);
    app.component('KRichText', KRichText);
    app.component('KStitok', KStitok);
    app.component('KToolTip', KToolTip);
    app.component('KUpload', KUpload);
    app.component('KVirtualKeyboard', KVirtualKeyboard);
    app.component('KSvgCheckBox', SvgCheckBox);
    app.component('KDivider', Divider);
    app.component('KSelect', Select);

    // Menu
    app.component('KMenu', KMenu);
    app.component('KMenuItem', KMenuItem);
    app.component('KSubMenu', KSubMenu);

    // Table
    app.component('KTable', Table);
    app.component('KTableCell', TableCell);
    app.component('KTableColumn', TableColumn);
    app.component('KTableColumnHeader', TableColumnHeader);
    app.component('KTableColumnSelect', TableColumnSelect);
    app.component('KTableFrame', TableFrame);
    app.component('KTableHeader', TableHeader);
    return app;
  },
};

export function isIdUpdateStatus(payload: unknown): payload is IdUpdateStatus {
  return 'updateStatus' in (payload as IdUpdateStatus);
}
