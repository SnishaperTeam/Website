# XAML 从入门到精通（零基础到进阶）

**更新日期：** 2026-3-4 · **作者：** SnishaperTeam

## 目录
1. [什么是 XAML？](#什么是-xaml)
2. [XAML 与 C# 的关系](#xaml-与-c-的关系)
3. [开发环境搭建](#开发环境搭建)
4. [XAML 基础语法](#xaml-基础语法)
5. [布局系统](#布局系统)
   - [Canvas](#canvas)
   - [StackPanel](#stackpanel)
   - [WrapPanel](#wrappanel)
   - [DockPanel](#dockpanel)
   - [Grid](#grid)
6. [常用控件](#常用控件)
   - [内容控件](#内容控件)
   - [文本控件](#文本控件)
   - [按钮控件](#按钮控件)
   - [选择控件](#选择控件)
   - [范围控件](#范围控件)
7. [资源系统](#资源系统)
   - [静态资源](#静态资源)
   - [动态资源](#动态资源)
   - [资源字典](#资源字典)
8. [样式和模板](#样式和模板)
   - [样式](#样式)
   - [控件模板](#控件模板)
   - [数据模板](#数据模板)
9. [数据绑定](#数据绑定)
   - [绑定基础](#绑定基础)
   - [绑定模式](#绑定模式)
   - [转换器](#转换器)
10. [事件处理](#事件处理)
    - [路由事件](#路由事件)
    - [命令](#命令)
11. [动画系统](#动画系统)
    - [基本动画](#基本动画)
    - [故事板](#故事板)
12. [自定义控件](#自定义控件)
    - [用户控件](#用户控件)
    - [自定义控件](#自定义控件-1)
13. [MVVM 模式](#mvvm-模式)
    - [ViewModel 基础](#viewmodel-基础)
    - [INotifyPropertyChanged](#inotifypropertychanged)
    - [命令实现](#命令实现)
14. [实践项目：待办事项应用](#实践项目待办事项应用)

---

## 什么是 XAML？

XAML（Extensible Application Markup Language，可扩展应用程序标记语言）是一种基于 XML 的声明式语言，专门用于定义用户界面。它最初由微软开发，主要用于：
- **WPF**（Windows Presentation Foundation）：Windows 桌面应用
- **UWP**（Universal Windows Platform）：Windows 通用应用
- **Xamarin.Forms**：跨平台移动应用
- **Silverlight**（已过时）

### XAML 的核心思想
XAML 遵循 "**声明式 UI**" 的理念：你描述界面应该是什么样子，而不是一步步告诉计算机如何构建它。这就像建筑师画建筑图纸，而不是亲自搬砖砌墙。

**详解**：声明式编程关注"做什么"而非"怎么做"。在 XAML 中，你只需声明需要什么控件、它们的属性和布局关系，WPF 引擎会自动处理创建和排列这些控件的细节。这大大简化了 UI 开发，提高了代码可读性。

### 为什么使用 XAML？
1. **分离关注点**：界面设计（XAML）与业务逻辑（C#）分离
2. **可视化设计**：结构清晰，易于理解
3. **工具支持**：Visual Studio 提供可视化设计器
4. **高效开发**：比纯代码创建界面更快

**详解**：XAML 的最大优势是实现了 UI 和逻辑的分离。设计师可以专注于 XAML 文件创建美观界面，开发者专注于 C# 代码实现业务逻辑。这种分工提高了团队协作效率，也使代码更易维护。

## XAML 与 C# 的关系

XAML 和 C# 是互补的：
- **XAML**：负责 "**长什么样**"（What it looks like）
- **C#**：负责 "**做什么事**"（What it does）

每个 XAML 文件都有一个对应的 C# 代码隐藏文件（`.xaml.cs`），两者通过部分类（`partial class`）机制连接。

### 示例：MainWindow.xaml 和 MainWindow.xaml.cs
```xml
<!-- MainWindow.xaml -->
<Window x:Class="MyApp.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="我的应用" Height="300" Width="400">
    <Grid>
        <Button Content="点击我" Click="Button_Click"/>
    </Grid>
</Window>
```

```csharp
// MainWindow.xaml.cs
using System.Windows;

namespace MyApp
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent(); // 初始化 XAML 定义的界面
        }
        
        private void Button_Click(object sender, RoutedEventArgs e)
        {
            MessageBox.Show("按钮被点击了！");
        }
    }
}
```

**详解**：`x:Class` 属性指定 XAML 对应的 C# 类。编译时，XAML 被转换为 C# 代码，与代码隐藏文件合并成一个完整的类。`InitializeComponent()` 方法由编译器生成，负责加载 XAML 并创建所有 UI 元素。`Click="Button_Click"` 将按钮的点击事件绑定到 C# 方法。

## 开发环境搭建

### 安装 Visual Studio
1. 下载 [Visual Studio Community](https://visualstudio.microsoft.com/)（免费）
2. 安装时选择工作负载：
   - **.NET 桌面开发**（用于 WPF）
   - **通用 Windows 平台开发**（用于 UWP）

### 创建第一个 WPF 项目
1. 打开 Visual Studio
2. 选择 "创建新项目"
3. 选择 "WPF 应用 (.NET Core)" 或 "WPF 应用 (.NET Framework)"
4. 命名项目（如 `MyFirstXamlApp`）
5. 点击 "创建"

**详解**：Visual Studio 提供了强大的 XAML 编辑器，包括智能感知、实时预览和错误检查。选择正确的项目模板确保获得所需的引用和配置。

## XAML 基础语法

### XAML 文档结构
```xml
<RootElement xmlns="default-namespace"
             xmlns:x="xaml-namespace"
             ... other attributes>
    <!-- Child elements -->
</RootElement>
```

**详解**：XAML 文档必须有一个根元素，通常是一个窗口或页面。命名空间声明告诉解析器如何解释元素和属性。

### 关键命名空间
- `xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"`：WPF 控件命名空间
- `xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"`：XAML 语言特性命名空间

**详解**：默认命名空间（无前缀）包含 WPF 控件如 Button、TextBox 等。`x` 命名空间包含 XAML 语言特性如 `x:Class`、`x:Name` 等。你可以添加其他命名空间引用自定义控件或第三方库。

### 常用属性
- `x:Class`：指定对应的 C# 类
- `x:Name`：为元素指定名称，可在 C# 中访问
- `x:Key`：在资源字典中标识资源

**详解**：`x:Class` 连接 XAML 和 C# 代码；`x:Name` 创建代码中可访问的变量（类似 C# 中的字段）；`x:Key` 在资源字典中唯一标识资源。

### 属性设置方式
#### 属性语法（Attribute Syntax）
```xml
<Button Content="确定" Width="100" Height="30"/>
```

**详解**：属性语法适用于简单值（字符串、数字、枚举）。属性值必须是字符串，但 XAML 解析器会自动转换为适当类型。

#### 属性元素语法（Property Element Syntax）
```xml
<Button>
    <Button.Content>
        <TextBlock Text="确定" FontSize="14"/>
    </Button.Content>
</Button>
```

**详解**：当属性值是复杂对象（如另一个控件）时，使用属性元素语法。这允许嵌套任意复杂的对象层次结构。

#### 内容属性（Content Property）
某些控件有默认内容属性，可以直接写内容：
```xml
<Button>
    <TextBlock Text="确定" FontSize="14"/>
</Button>
<!-- 等价于 -->
<Button>
    <Button.Content>
        <TextBlock Text="确定" FontSize="14"/>
    </Button.Content>
</Button>
```

**详解**：内容控件（如 Button、Label）有一个标记为 `[ContentProperty]` 的属性，允许省略属性元素语法。这简化了常见场景的 XAML。

## 布局系统

WPF 提供了多种布局容器，每种适用于不同场景。

### Canvas
绝对定位，适合精确控制位置的场景（如图表、游戏）。

```xml
<Canvas Width="200" Height="200">
    <Rectangle Fill="Red" Width="50" Height="50" 
               Canvas.Left="10" Canvas.Top="20"/>
    <Ellipse Fill="Blue" Width="30" Height="30" 
             Canvas.Left="100" Canvas.Top="150"/>
</Canvas>
```

**详解**：Canvas 使用附加属性 `Canvas.Left` 和 `Canvas.Top` 指定子元素的绝对位置。它不响应子元素大小变化，适合静态布局或需要精确控制的场景。缺点是不能自适应窗口大小变化。

### StackPanel
元素按顺序堆叠，垂直或水平排列。

```xml
<StackPanel Orientation="Vertical">
    <Button Content="按钮1"/>
    <Button Content="按钮2"/>
    <Button Content="按钮3"/>
</StackPanel>

<StackPanel Orientation="Horizontal">
    <TextBlock Text="姓名:"/>
    <TextBox Width="100"/>
</StackPanel>
```

**详解**：StackPanel 按指定方向（垂直或水平）排列子元素。每个元素占据所需空间，剩余空间平均分配（如果设置了 `HorizontalAlignment`/`VerticalAlignment` 为 Stretch）。适合简单的线性布局，如表单或工具栏。

### WrapPanel
类似 StackPanel，但当空间不足时自动换行。

```xml
<WrapPanel>
    <Button Content="选项1" Margin="5"/>
    <Button Content="选项2" Margin="5"/>
    <Button Content="选项3" Margin="5"/>
    <!-- 当窗口变窄时，按钮会自动换行 -->
</WrapPanel>
```

**详解**：WrapPanel 在主方向上排列元素，当空间不足时自动换行到下一行。适合标签云、选项卡等需要流式布局的场景。

### DockPanel
元素停靠在容器的边缘。

```xml
<DockPanel>
    <Menu DockPanel.Dock="Top">
        <MenuItem Header="文件"/>
        <MenuItem Header="编辑"/>
    </Menu>
    <StatusBar DockPanel.Dock="Bottom">
        <TextBlock Text="就绪"/>
    </StatusBar>
    <TreeView DockPanel.Dock="Left" Width="150"/>
    <TextBox AcceptsReturn="True"/> <!-- 填充剩余空间 -->
</DockPanel>
```

**详解**：DockPanel 使用附加属性 `DockPanel.Dock` 指定子元素停靠位置（Top、Bottom、Left、Right）。最后一个子元素自动填充剩余空间。适合典型的 Windows 应用布局（菜单顶部、状态栏底部、工具栏左侧、主内容区）。

### Grid
最强大的布局容器，类似表格。

```xml
<Grid>
    <!-- 定义行列 -->
    <Grid.RowDefinitions>
        <RowDefinition Height="Auto"/> <!-- 自动高度 -->
        <RowDefinition Height="*"/>    <!-- 占剩余空间 -->
        <RowDefinition Height="2*"/>   <!-- 占2倍剩余空间 -->
    </Grid.RowDefinitions>
    <Grid.ColumnDefinitions>
        <ColumnDefinition Width="100"/>
        <ColumnDefinition Width="*"/>
        <ColumnDefinition Width="200"/>
    </Grid.ColumnDefinitions>
    
    <!-- 放置元素 -->
    <TextBlock Text="姓名:" Grid.Row="0" Grid.Column="0"/>
    <TextBox Grid.Row="0" Grid.Column="1" Grid.ColumnSpan="2"/>
    
    <ListBox Grid.Row="1" Grid.Column="0" Grid.RowSpan="2"/>
    <TextBox Grid.Row="1" Grid.Column="1" Grid.RowSpan="2" 
             AcceptsReturn="True"/>
    <Button Content="提交" Grid.Row="2" Grid.Column="2"/>
</Grid>
```

**详解**：Grid 通过行定义（RowDefinitions）和列定义（ColumnDefinitions）创建表格结构。行高/列宽可以是：
- **绝对值**：如 `Width="100"`
- **自动**：`Height="Auto"` 根据内容调整
- **星号**：`Width="*"` 占剩余空间，`Width="2*"` 占2倍比例

使用附加属性 `Grid.Row`、`Grid.Column`、`Grid.RowSpan`、`Grid.ColumnSpan` 定位元素。Grid 是最灵活的布局容器，适合复杂表单和仪表板。

## 常用控件

### 内容控件
可以包含单个内容的控件。

#### Label
```xml
<Label Content="用户名:" Target="{Binding ElementName=usernameBox}"/>
<TextBox x:Name="usernameBox"/>
```

**详解**：Label 不仅显示文本，还支持访问键（Alt+字母）和焦点导航。`Target` 属性指定关联的控件，按 Alt+访问键时焦点会跳转到目标控件。

#### Button
```xml
<Button Content="提交" 
        Click="SubmitButton_Click"
        IsDefault="True" <!-- 按回车触发 -->
        IsCancel="True"/> <!-- 按ESC触发 -->
```

**详解**：Button 是最常见的交互控件。`IsDefault` 使按钮在按回车时触发；`IsCancel` 使按钮在按 ESC 时触发。Content 可以是任意对象，不仅限于文本。

### 文本控件

#### TextBlock
只读文本显示。
```xml
<TextBlock Text="欢迎使用我们的应用" 
           FontSize="18" 
           FontWeight="Bold"
           TextWrapping="Wrap"
           TextAlignment="Center"/>
```

**详解**：TextBlock 用于显示只读文本，支持富文本格式（粗体、斜体等）。`TextWrapping="Wrap"` 使文本在边界处自动换行；`TextAlignment` 控制文本对齐方式。

#### TextBox
单行或多行文本输入。
```xml
<TextBox Text="默认文本" 
         MaxLength="100"
         IsReadOnly="False"
         AcceptsReturn="True" <!-- 允许多行 -->
         TextChanged="TextBox_TextChanged"/>
```

**详解**：TextBox 是文本输入控件。`MaxLength` 限制输入长度；`IsReadOnly` 使文本不可编辑但仍可选择；`AcceptsReturn` 允许在多行模式下输入换行符。

#### RichTextBox
富文本编辑。
```xml
<RichTextBox>
    <FlowDocument>
        <Paragraph>
            <Run Text="普通文本"/>
            <Bold>粗体文本</Bold>
            <Italic>斜体文本</Italic>
        </Paragraph>
    </FlowDocument>
</RichTextBox>
```

**详解**：RichTextBox 支持富文本编辑，基于 FlowDocument 模型。FlowDocument 提供文档级功能如分页、列布局等，适合文档编辑器。

### 按钮控件

#### ToggleButton
开关按钮。
```xml
<ToggleButton Content="启用" 
              IsChecked="True"
              Checked="OnChecked"
              Unchecked="OnUnchecked"/>
```

**详解**：ToggleButton 有两种状态：选中（IsChecked=true）和未选中。Checked/Unchecked 事件分别在状态改变时触发。常用于开关、复选等场景。

#### RadioButton
单选按钮组。
```xml
<StackPanel>
    <RadioButton GroupName="Gender" Content="男"/>
    <RadioButton GroupName="Gender" Content="女"/>
</StackPanel>
```

**详解**：RadioButton 用于互斥选择。同一容器内或具有相同 `GroupName` 的 RadioButton 自动形成组，只能选择一个。GroupName 允许跨容器分组。

#### CheckBox
复选框。
```xml
<CheckBox Content="同意条款" 
          IsChecked="True"
          Checked="OnAgreeChecked"/>
```

**详解**：CheckBox 支持三种状态：Checked、Unchecked、Indeterminate（不确定）。Indeterminate 状态用于表示部分选中（如树形结构的父节点）。

### 选择控件

#### ComboBox
下拉选择框。
```xml
<ComboBox SelectedIndex="0" 
          SelectionChanged="ComboBox_SelectionChanged">
    <ComboBoxItem Content="选项1"/>
    <ComboBoxItem Content="选项2"/>
    <ComboBoxItem Content="选项3"/>
</ComboBox>
```

**详解**：ComboBox 结合了 TextBox 和 ListBox，提供下拉选择。可以设置 `IsEditable="True"` 允许用户输入自定义值。ItemsSource 绑定数据源时更常用。

#### ListBox
列表选择。
```xml
<ListBox SelectionMode="Extended" <!-- 多选 -->
         ItemsSource="{Binding Students}"
         SelectedItem="{Binding SelectedStudent}">
    <ListBox.ItemTemplate>
        <DataTemplate>
            <TextBlock Text="{Binding Name}"/>
        </DataTemplate>
    </ListBox.ItemTemplate>
</ListBox>
```

**详解**：ListBox 显示项目列表，支持单选或多选。`ItemsSource` 绑定数据集合；`ItemTemplate` 定义每个项目的显示方式。VirtualizingStackPanel 作为面板时支持虚拟化，提高大数据集性能。

#### ListView
增强版 ListBox，支持多列。
```xml
<ListView ItemsSource="{Binding Products}">
    <ListView.View>
        <GridView>
            <GridViewColumn Header="名称" DisplayMemberBinding="{Binding Name}"/>
            <GridViewColumn Header="价格" DisplayMemberBinding="{Binding Price}"/>
            <GridViewColumn Header="库存" DisplayMemberBinding="{Binding Stock}"/>
        </GridView>
    </ListView.View>
</ListView>
```

**详解**：ListView 通过 View 属性支持不同视图。GridView 提供类似 Windows 资源管理器的多列视图。DisplayMemberBinding 绑定列数据，CellTemplate 可自定义单元格内容。

### 范围控件

#### Slider
滑动条。
```xml
<Slider Minimum="0" Maximum="100" Value="50" 
        ValueChanged="Slider_ValueChanged"/>
```

**详解**：Slider 允许用户在范围内选择值。TickFrequency/TickPlacement 控制刻度显示；IsSnapToTickEnabled 使滑块对齐刻度。常用于音量、亮度等连续值调节。

#### ProgressBar
进度条。
```xml
<ProgressBar Value="75" Maximum="100" 
             Height="20" 
             IsIndeterminate="False"/> <!-- True 表示不确定进度 -->
```

**详解**：ProgressBar 显示操作进度。确定模式（IsIndeterminate=False）显示具体进度；不确定模式显示循环动画，表示操作正在进行但无法确定进度。

## 资源系统

资源允许你定义可重用的对象，如颜色、画笔、样式等。

### 静态资源
在加载时解析，性能更好。
```xml
<Window.Resources>
    <SolidColorBrush x:Key="PrimaryBrush" Color="Blue"/>
    <Style x:Key="BigButton" TargetType="Button">
        <Setter Property="FontSize" Value="16"/>
        <Setter Property="Background" Value="{StaticResource PrimaryBrush}"/>
    </Style>
</Window.Resources>

<Button Style="{StaticResource BigButton}" Content="大按钮"/>
```

**详解**：StaticResource 在 XAML 加载时一次性解析，后续不再检查资源变化。适用于不变的资源如颜色、字体等。性能优于 DynamicResource。

### 动态资源
在运行时解析，可以动态更改。
```xml
<Button Background="{DynamicResource ThemeBrush}"/>
```

**详解**：DynamicResource 在每次需要时解析资源，支持运行时动态更换（如主题切换）。性能开销较大，仅在需要动态更新时使用。

### 资源字典
将资源组织到单独的文件中。
```xml
<!-- Themes/LightTheme.xaml -->
<ResourceDictionary xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
                    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">
    <SolidColorBrush x:Key="BackgroundBrush" Color="White"/>
    <SolidColorBrush x:Key="ForegroundBrush" Color="Black"/>
</ResourceDictionary>

<!-- App.xaml -->
<Application.Resources>
    <ResourceDictionary>
        <ResourceDictionary.MergedDictionaries>
            <ResourceDictionary Source="Themes/LightTheme.xaml"/>
        </ResourceDictionary.MergedDictionaries>
    </ResourceDictionary>
</Application.Resources>
```

**详解**：ResourceDictionary 允许将资源分离到外部文件，便于主题管理和团队协作。MergedDictionaries 合并多个资源字典，支持主题切换。

## 样式和模板

### 样式
批量设置控件属性。
```xml
<Style TargetType="Button">
    <Setter Property="FontSize" Value="14"/>
    <Setter Property="Padding" Value="10,5"/>
    <Setter Property="Margin" Value="5"/>
    <Style.Triggers>
        <Trigger Property="IsMouseOver" Value="True">
            <Setter Property="Background" Value="LightBlue"/>
        </Trigger>
        <Trigger Property="IsPressed" Value="True">
            <Setter Property="Background" Value="DarkBlue"/>
        </Trigger>
    </Style.Triggers>
</Style>
<!-- 所有按钮都会应用这个样式 -->
```

**详解**：Style 允许统一设置控件外观。TargetType 指定应用样式的控件类型；Setter 设置属性值；Triggers 定义条件样式（如鼠标悬停效果）。隐式样式（无 x:Key）自动应用于所有匹配类型的控件。

### 控件模板
完全重新定义控件的外观。
```xml
<Style TargetType="Button">
    <Setter Property="Template">
        <Setter.Value>
            <ControlTemplate TargetType="Button">
                <Border x:Name="border" 
                        Background="LightGray" 
                        BorderBrush="Gray" 
                        BorderThickness="1"
                        CornerRadius="5">
                    <ContentPresenter HorizontalAlignment="Center" 
                                      VerticalAlignment="Center"/>
                </Border>
                <ControlTemplate.Triggers>
                    <Trigger Property="IsMouseOver" Value="True">
                        <Setter TargetName="border" Property="Background" Value="LightBlue"/>
                    </Trigger>
                </ControlTemplate.Triggers>
            </ControlTemplate>
        </Setter.Value>
    </Setter>
</Style>
```

**详解**：ControlTemplate 定义控件的视觉结构。ContentPresenter 显示控件的内容；Triggers 响应控件状态变化。模板保留控件的所有功能（如点击事件），只改变外观。

### 数据模板
定义数据对象的显示方式。
```xml
<DataTemplate DataType="{x:Type local:Student}">
    <StackPanel Orientation="Horizontal">
        <TextBlock Text="{Binding Name}" FontWeight="Bold"/>
        <TextBlock Text="{Binding Age}" Margin="10,0,0,0"/>
    </StackPanel>
</DataTemplate>

<!-- 使用 -->
<ContentControl Content="{Binding CurrentStudent}"/>
```

**详解**：DataTemplate 定义如何显示数据对象。DataType 指定适用的数据类型；ContentControl/ItemsControl 自动应用匹配的 DataTemplate。这是 MVVM 模式中视图与数据解耦的关键。

## 数据绑定

数据绑定是 WPF 的核心特性，实现界面与数据的自动同步。

### 绑定基础
```xml
<TextBox Text="{Binding UserName}"/>
<TextBlock Text="{Binding UserName}"/>
```

对应的 ViewModel：
```csharp
public class MainViewModel : INotifyPropertyChanged
{
    private string _userName;
    public string UserName
    {
        get => _userName;
        set
        {
            _userName = value;
            OnPropertyChanged();
        }
    }
    
    public event PropertyChangedEventHandler PropertyChanged;
    protected virtual void OnPropertyChanged([CallerMemberName] string propertyName = null)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
}
```

在代码隐藏中设置 DataContext：
```csharp
public MainWindow()
{
    InitializeComponent();
    DataContext = new MainViewModel();
}
```

**详解**：数据绑定建立 UI 元素和数据对象之间的连接。Binding 表达式指定绑定路径（UserName）；DataContext 提供绑定源；INotifyPropertyChanged 通知 UI 数据变化。这种机制实现了自动同步，无需手动更新 UI。

### 绑定模式
- `OneWay`：源 → 目标（默认）
- `TwoWay`：源 ↔ 目标
- `OneTime`：只在初始化时绑定
- `OneWayToSource`：目标 → 源

```xml
<TextBox Text="{Binding UserName, Mode=TwoWay}"/>
<Slider Value="{Binding Volume, Mode=TwoWay}"/>
```

**详解**：绑定模式控制数据流向。TwoWay 用于可编辑控件（如 TextBox）；OneWay 用于只读显示（如 TextBlock）；OneTime 用于静态数据；OneWayToSource 用于特殊情况（如保存用户首选项）。

### 转换器
在绑定时转换数据。
```csharp
public class BooleanToVisibilityConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        return (bool)value ? Visibility.Visible : Visibility.Collapsed;
    }
    
    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        return (Visibility)value == Visibility.Visible;
    }
}
```

```xml
<Window.Resources>
    <local:BooleanToVisibilityConverter x:Key="BoolToVis"/>
</Window.Resources>

<TextBlock Text="秘密信息" 
           Visibility="{Binding IsAdmin, Converter={StaticResource BoolToVis}}"/>
```

**详解**：IValueConverter 在绑定时转换数据。Convert 用于源到目标；ConvertBack 用于目标到源（TwoWay 绑定时）。转换器使绑定更灵活，处理类型不匹配或逻辑转换。

## 事件处理

### 路由事件
WPF 事件可以冒泡或隧道传播。

```xml
<Grid PreviewMouseDown="Grid_PreviewMouseDown"> <!-- 隧道事件 -->
    <StackPanel MouseDown="StackPanel_MouseDown"> <!-- 冒泡事件 -->
        <Button Content="点击" Click="Button_Click"/>
    </StackPanel>
</Grid>
```

事件处理顺序：
1. `PreviewMouseDown`（隧道）：Grid → StackPanel → Button
2. `MouseDown`（冒泡）：Button → StackPanel → Grid

**详解**：路由事件沿元素树传播。隧道事件（PreviewXXX）从根到源；冒泡事件（XXX）从源到根。这允许在不同层次处理同一事件，实现全局处理（如日志记录）或拦截（如权限检查）。

### 命令
命令提供更好的解耦，支持撤销、快捷键等。

```csharp
public class RelayCommand : ICommand
{
    private readonly Action _execute;
    private readonly Func<bool> _canExecute;
    
    public RelayCommand(Action execute, Func<bool> canExecute = null)
    {
        _execute = execute;
        _canExecute = canExecute;
    }
    
    public bool CanExecute(object parameter) => _canExecute?.Invoke() ?? true;
    public void Execute(object parameter) => _execute();
    public event EventHandler CanExecuteChanged;
    
    public void RaiseCanExecuteChanged() => CanExecuteChanged?.Invoke(this, EventArgs.Empty);
}
```

```csharp
// ViewModel
public class MainViewModel
{
    public ICommand SaveCommand { get; }
    
    public MainViewModel()
    {
        SaveCommand = new RelayCommand(Save, CanSave);
    }
    
    private void Save() { /* 保存逻辑 */ }
    private bool CanSave() => !string.IsNullOrEmpty(Data);
}
```

```xml
<!-- XAML -->
<Button Content="保存" Command="{Binding SaveCommand}"/>
```

**详解**：ICommand 接口解耦 UI 和逻辑。CanExecute 控制命令是否可用（自动禁用按钮）；Execute 执行操作。命令支持快捷键、工具提示等，是 MVVM 模式的核心。

## 动画系统

### 基本动画
```xml
<Storyboard x:Key="FadeIn">
    <DoubleAnimation Storyboard.TargetProperty="Opacity"
                     From="0" To="1" Duration="0:0:1"/>
</Storyboard>

<!-- 触发动画 -->
<Button Content="淡入" Click="StartFadeIn"/>

private void StartFadeIn(object sender, RoutedEventArgs e)
{
    var storyboard = (Storyboard)FindResource("FadeIn");
    storyboard.Begin(this);
}
```

**详解**：动画系统基于属性系统，平滑改变属性值。DoubleAnimation 用于数值属性；Duration 指定动画时长（格式：时:分:秒）。Storyboard 组织多个动画，支持 Begin/Stop/Pause 控制。

### 故事板
组合多个动画。
```xml
<Storyboard x:Key="MoveAndScale">
    <DoubleAnimation Storyboard.TargetProperty="(Canvas.Left)"
                     From="0" To="200" Duration="0:0:2"/>
    <DoubleAnimation Storyboard.TargetProperty="RenderTransform.ScaleX"
                     From="1" To="2" Duration="0:0:2"/>
    <DoubleAnimation Storyboard.TargetProperty="RenderTransform.ScaleY"
                     From="1" To="2" Duration="0:0:2"/>
</Storyboard>
```

**详解**：Storyboard 可以同时运行动画，创建复杂效果。TargetProperty 指定要动画的属性，括号语法用于附加属性。RenderTransform 允许变换（缩放、旋转等）而不影响布局。

## 自定义控件

### 用户控件
组合现有控件创建新控件。
```xml
<!-- MyUserControl.xaml -->
<UserControl x:Class="MyApp.MyUserControl"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">
    <Grid>
        <TextBlock Text="{Binding Caption}" FontWeight="Bold"/>
        <TextBox Text="{Binding Value}" Margin="0,20,0,0"/>
    </Grid>
</UserControl>
```

```csharp
// MyUserControl.xaml.cs
public partial class MyUserControl : UserControl
{
    public static readonly DependencyProperty CaptionProperty =
        DependencyProperty.Register("Caption", typeof(string), typeof(MyUserControl));
    
    public static readonly DependencyProperty ValueProperty =
        DependencyProperty.Register("Value", typeof(string), typeof(MyUserControl));
    
    public string Caption
    {
        get => (string)GetValue(CaptionProperty);
        set => SetValue(CaptionProperty, value);
    }
    
    public string Value
    {
        get => (string)GetValue(ValueProperty);
        set => SetValue(ValueProperty, value);
    }
    
    public MyUserControl()
    {
        InitializeComponent();
        DataContext = this;
    }
}
```

```xml
<!-- 使用 -->
<local:MyUserControl Caption="用户名" Value="张三"/>
```

**详解**：UserControl 组合现有控件创建复合控件。DependencyProperty 支持数据绑定、动画和样式；DataContext=this 使内部绑定指向控件本身。适合快速创建特定用途的控件。

### 自定义控件
从头创建控件，提供完整的模板支持。
```csharp
// MyCustomControl.cs
public class MyCustomControl : Control
{
    static MyCustomControl()
    {
        DefaultStyleKeyProperty.OverrideMetadata(typeof(MyCustomControl), 
            new FrameworkPropertyMetadata(typeof(MyCustomControl)));
    }
    
    public static readonly DependencyProperty HeaderProperty =
        DependencyProperty.Register("Header", typeof(string), typeof(MyCustomControl));
    
    public string Header
    {
        get => (string)GetValue(HeaderProperty);
        set => SetValue(HeaderProperty, value);
    }
}
```

```xml
<!-- Themes/Generic.xaml -->
<ResourceDictionary xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
                    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
                    xmlns:local="clr-namespace:MyApp">
    <Style TargetType="{x:Type local:MyCustomControl}">
        <Setter Property="Template">
            <Setter.Value>
                <ControlTemplate TargetType="{x:Type local:MyCustomControl}">
                    <Border Background="{TemplateBinding Background}"
                            BorderBrush="{TemplateBinding BorderBrush}"
                            BorderThickness="{TemplateBinding BorderThickness}">
                        <TextBlock Text="{TemplateBinding Header}" 
                                   FontWeight="Bold" 
                                   HorizontalAlignment="Center"/>
                    </Border>
                </ControlTemplate>
            </Setter.Value>
        </Setter>
    </Style>
</ResourceDictionary>
```

**详解**：CustomControl 从 Control 或其他基类派生，提供完整的模板支持。Generic.xaml 定义默认样式；TemplateBinding 在模板中绑定控件属性。这种控件可被样式完全重定义，适合创建通用控件库。

## MVVM 模式

MVVM（Model-View-ViewModel）是 WPF 推荐的架构模式。

### ViewModel 基础
```csharp
public class StudentViewModel : INotifyPropertyChanged
{
    private string _name;
    public string Name
    {
        get => _name;
        set
        {
            if (_name != value)
            {
                _name = value;
                OnPropertyChanged();
            }
        }
    }
    
    public event PropertyChangedEventHandler PropertyChanged;
    protected virtual void OnPropertyChanged([CallerMemberName] string propertyName = null)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
}
```

**详解**：ViewModel 充当 View 和 Model 之间的桥梁。它暴露数据和命令供 View 绑定，封装业务逻辑，保持 View 简单。INotifyPropertyChanged 通知 View 数据变化。

### INotifyPropertyChanged
实现属性变化通知。
```csharp
// 更简洁的实现（使用 CallerMemberName）
public class BaseViewModel : INotifyPropertyChanged
{
    public event PropertyChangedEventHandler PropertyChanged;
    
    protected virtual void SetProperty<T>(ref T field, T value, [CallerMemberName] string propertyName = null)
    {
        if (!EqualityComparer<T>.Default.Equals(field, value))
        {
            field = value;
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}

// 使用
public class StudentViewModel : BaseViewModel
{
    private string _name;
    public string Name
    {
        get => _name;
        set => SetProperty(ref _name, value);
    }
}
```

**详解**：BaseViewModel 简化 INotifyPropertyChanged 实现。SetProperty 方法自动处理相等比较和属性变更通知，减少样板代码。CallerMemberName 属性自动传递属性名，避免字符串错误。

### 命令实现
```csharp
public class MainViewModel : BaseViewModel
{
    private readonly List<TodoItem> _allItems = new List<TodoItem>();
    private string _newItemTitle;
    private TodoItem _selectedItem;
    private bool _showCompleted;
    
    public ObservableCollection<TodoItem> Items { get; } = new ObservableCollection<TodoItem>();
    
    public string NewItemTitle
    {
        get => _newItemTitle;
        set => SetProperty(ref _newItemTitle, value);
    }
    
    public TodoItem SelectedItem
    {
        get => _selectedItem;
        set => SetProperty(ref _selectedItem, value);
    }
    
    public bool ShowCompleted
    {
        get => _showCompleted;
        set
        {
            if (SetProperty(ref _showCompleted, value))
            {
                FilterItems();
            }
        }
    }
    
    public ICommand AddItemCommand { get; }
    public ICommand DeleteItemCommand { get; }
    public ICommand ToggleCompletedCommand { get; }
    
    public MainViewModel()
    {
        AddItemCommand = new RelayCommand(AddItem, CanAddItem);
        DeleteItemCommand = new RelayCommand(DeleteItem, CanDeleteItem);
        ToggleCompletedCommand = new RelayCommand(ToggleCompleted, CanToggleCompleted);
    }
    
    private void AddItem()
    {
        var newItem = new TodoItem
        {
            Id = _allItems.Count + 1,
            Title = NewItemTitle
        };
        
        _allItems.Add(newItem);
        FilterItems();
        NewItemTitle = "";
    }
    
    private bool CanAddItem() => !string.IsNullOrWhiteSpace(NewItemTitle);
    
    private void DeleteItem()
    {
        if (SelectedItem != null)
        {
            _allItems.Remove(SelectedItem);
            FilterItems();
            SelectedItem = null;
        }
    }
    
    private bool CanDeleteItem() => SelectedItem != null;
    
    private void ToggleCompleted()
    {
        if (SelectedItem != null)
        {
            SelectedItem.IsCompleted = !SelectedItem.IsCompleted;
            FilterItems();
        }
    }
    
    private bool CanToggleCompleted() => SelectedItem != null;
    
    private void FilterItems()
    {
        Items.Clear();
        var filtered = _allItems.Where(item => ShowCompleted || !item.IsCompleted);
        foreach (var item in filtered)
        {
            Items.Add(item);
        }
    }
}
```

**详解**：ViewModel 包含数据（Items、NewItemTitle）、命令（AddItemCommand）和业务逻辑（FilterItems）。ObservableCollection 自动通知集合变化；RelayCommand 封装命令逻辑；属性变更触发相关操作（如过滤）。

## 实践项目：待办事项应用

创建一个完整的待办事项应用，展示 XAML 和 MVVM 的实际应用。

### Model
```csharp
public class TodoItem
{
    public int Id { get; set; }
    public string Title { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.Now;
}
```

**详解**：Model 表示业务数据，通常是简单的 POCO（Plain Old CLR Object）类。它不包含 UI 逻辑或绑定代码，保持纯净。

### ViewModel
```csharp
public class MainViewModel : BaseViewModel
{
    private readonly List<TodoItem> _allItems = new List<TodoItem>();
    private string _newItemTitle;
    private TodoItem _selectedItem;
    private bool _showCompleted;
    
    public ObservableCollection<TodoItem> Items { get; } = new ObservableCollection<TodoItem>();
    
    public string NewItemTitle
    {
        get => _newItemTitle;
        set => SetProperty(ref _newItemTitle, value);
    }
    
    public TodoItem SelectedItem
    {
        get => _selectedItem;
        set => SetProperty(ref _selectedItem, value);
    }
    
    public bool ShowCompleted
    {
        get => _showCompleted;
        set
        {
            if (SetProperty(ref _showCompleted, value))
            {
                FilterItems();
            }
        }
    }
    
    public ICommand AddItemCommand { get; }
    public ICommand DeleteItemCommand { get; }
    public ICommand ToggleCompletedCommand { get; }
    
    public MainViewModel()
    {
        AddItemCommand = new RelayCommand(AddItem, CanAddItem);
        DeleteItemCommand = new RelayCommand(DeleteItem, CanDeleteItem);
        ToggleCompletedCommand = new RelayCommand(ToggleCompleted, CanToggleCompleted);
    }
    
    private void AddItem()
    {
        var newItem = new TodoItem
        {
            Id = _allItems.Count + 1,
            Title = NewItemTitle
        };
        
        _allItems.Add(newItem);
        FilterItems();
        NewItemTitle = "";
    }
    
    private bool CanAddItem() => !string.IsNullOrWhiteSpace(NewItemTitle);
    
    private void DeleteItem()
    {
        if (SelectedItem != null)
        {
            _allItems.Remove(SelectedItem);
            FilterItems();
            SelectedItem = null;
        }
    }
    
    private bool CanDeleteItem() => SelectedItem != null;
    
    private void ToggleCompleted()
    {
        if (SelectedItem != null)
        {
            SelectedItem.IsCompleted = !SelectedItem.IsCompleted;
            FilterItems();
        }
    }
    
    private bool CanToggleCompleted() => SelectedItem != null;
    
    private void FilterItems()
    {
        Items.Clear();
        var filtered = _allItems.Where(item => ShowCompleted || !item.IsCompleted);
        foreach (var item in filtered)
        {
            Items.Add(item);
        }
    }
}
```

**详解**：ViewModel 管理应用状态和逻辑。它使用 ObservableCollection 自动更新 UI；命令处理用户交互；属性变更触发过滤。ViewModel 完全独立于 View，便于测试。

### View (XAML)
```xml
<Window x:Class="TodoApp.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
        mc:Ignorable="d"
        Title="待办事项" Height="500" Width="400">
    <Window.Resources>
        <Style TargetType="TextBlock">
            <Setter Property="Margin" Value="5"/>
        </Style>
        <Style TargetType="Button">
            <Setter Property="Margin" Value="5"/>
            <Setter Property="Padding" Value="10,5"/>
        </Style>
        <DataTemplate x:Key="TodoItemTemplate">
            <StackPanel Orientation="Horizontal">
                <CheckBox IsChecked="{Binding IsCompleted}" Margin="0,0,10,0"/>
                <TextBlock Text="{Binding Title}" 
                           TextDecorations="{Binding IsCompleted, Converter={StaticResource BoolToTextDecorations}}"/>
                <TextBlock Text="{Binding CreatedDate, StringFormat='({0:MM/dd})'}" 
                           Foreground="Gray" FontStyle="Italic" Margin="10,0,0,0"/>
            </StackPanel>
        </DataTemplate>
    </Window.Resources>
    
    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="*"/>
            <RowDefinition Height="Auto"/>
        </Grid.RowDefinitions>
        
        <!-- 输入区域 -->
        <StackPanel Grid.Row="0" Orientation="Horizontal" Margin="10">
            <TextBox Text="{Binding NewItemTitle, UpdateSourceTrigger=PropertyChanged}" 
                     Width="200" Height="25"/>
            <Button Content="添加" Command="{Binding AddItemCommand}"/>
        </StackPanel>
        
        <!-- 列表区域 -->
        <ListBox Grid.Row="1" ItemsSource="{Binding Items}" 
                 ItemTemplate="{StaticResource TodoItemTemplate}"
                 SelectedItem="{Binding SelectedItem}"
                 Margin="10"/>
        
        <!-- 底部操作 -->
        <StackPanel Grid.Row="2" Orientation="Horizontal" HorizontalAlignment="Right" Margin="10">
            <CheckBox Content="显示已完成" IsChecked="{Binding ShowCompleted}"/>
            <Button Content="删除" Command="{Binding DeleteItemCommand}"/>
            <Button Content="切换完成" Command="{Binding ToggleCompletedCommand}"/>
        </StackPanel>
    </Grid>
</Window>
```

**详解**：View 专注于 UI 呈现。Grid 布局分为三部分；资源定义样式和数据模板；绑定连接 ViewModel 属性和命令；UpdateSourceTrigger=PropertyChanged 使 TextBox 实时更新绑定源。

### 转换器
```csharp
public class BooleanToTextDecorationsConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        return (bool)value ? TextDecorations.Strikethrough : null;
    }
    
    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}
```

**详解**：转换器将布尔值转换为文本装饰（删除线）。已完成的待办事项显示删除线，提供直观的视觉反馈。

### App.xaml
```xml
<Application x:Class="TodoApp.App"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             xmlns:local="clr-namespace:TodoApp"
             StartupUri="MainWindow.xaml">
    <Application.Resources>
        <local:BooleanToTextDecorationsConverter x:Key="BoolToTextDecorations"/>
    </Application.Resources>
</Application>
```

**详解**：App.xaml 定义应用级资源。转换器在应用级别注册，可在任何窗口使用。

### 代码隐藏
```csharp
public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();
        DataContext = new MainViewModel();
    }
}
```

**详解**：代码隐藏非常简洁，只负责设置 DataContext。所有逻辑都在 ViewModel 中，实现关注点分离。

这个项目展示了：
- MVVM 架构
- 数据绑定
- 命令模式
- 转换器
- 资源和样式
- 布局系统
- 集合操作

## 总结

XAML 是创建现代 Windows 应用界面的强大工具。学习路径建议：

1. **掌握基础**：布局、控件、资源
2. **理解数据绑定**：这是 WPF 的核心
3. **学习 MVVM**：最佳实践架构
4. **探索高级特性**：动画、自定义控件
5. **实践项目**：从简单到复杂

记住：XAML 的优势在于声明式和分离关注点。尽量避免在代码隐藏中操作 UI 元素，而是通过数据绑定和命令来实现交互。祝你学习愉快！