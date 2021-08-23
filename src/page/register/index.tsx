import React from 'react';
import './index.less';
import { Menu } from 'antd';
import { ChForm, FormItemType } from 'ch-ui';
const { SubMenu } = Menu;

function Register() {
  return (
    <div className="register-page flex-column-all-center">
      <div className="register-header m-b-20"></div>
      <div className="register-card">
        <div className="register-title">注册账号</div>
        <div className="register-type-select">
          <Menu mode="horizontal">
            <Menu.Item className="register-type-select-wrap" key="phone">
              <div className="register-type-select-item">手机注册</div>
            </Menu.Item>
            <Menu.Item className="m-l-20 register-type-select-wrap" key="email">
              <div className="register-type-select-item">邮箱注册</div>
            </Menu.Item>
          </Menu>
        </div>
        <div className="m-t-30">
          <ChForm
            formData={[
              {
                type: FormItemType.input,
                label: '',
                name: 'email',
                placeholder: '邮箱',
              },
              {
                type: FormItemType.input,
                label: '',
                name: 'emailCode',
                placeholder: '邮箱验证码',
              },
              {
                type: FormItemType.input,
                label: '',
                name: 'password',
                placeholder: '设置密码',
              },
              {
                type: FormItemType.input,
                label: '',
                name: 'confirmPassword',
                placeholder: '确认密码',
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default Register;
