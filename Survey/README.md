# Questions

* How to require a module?
* How to update view after data loaded by Ajax?
    - $digest()

----

# Tasks

backend
----
* 登陆用户或游客(get cookie) [DONE: 只有登陆用户]
* 判断用户进度(intergrate with backend) [DONE: request json {userId: '', currentGroupIndex: '', groupCount: ''}]
	- 是否是第一次使用：第一页问题
	- 是否已经完成: 直接显示最终结果页
	- 是否完成到某一步：显示最近的一组题 
* 保存结果失败，拿问题列表失败
    - 最后检查一致性
    - 如果读不到列表，显示刷新按钮，要求用户刷新

css
----
* LOGO及描述 [DONE]
* 整体CSS风格，颜色，特效   [DONE]
* 问题之间的分割 [DONE]
* 图片的文字处理 [DONE]
* 更新进度条 [DONE]
* 最终结果页（二维码关注）
* Loading页面
* Animations
* scroll to element

logic
----
* 多选处理  [DONE]
    - 需要判断最少和最多可以选择多少个 [DONE]
    - 选择完成才能进入下一页 [DONE]
* 问题ID, 答案ID, 结果回传JSON [DONE]
* 异步获取2页之后的结果
* 直接关闭页面发送请求

