<template>
  <div class="container py-5" style="margin-top: 60px;">
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <article class="blog-post">
          <header class="mb-4">
            <h1 class="fw-bold">C++完全入门指南：从Hello World到结构体</h1>
            <div class="text-muted mb-3">
              <time datetime="2026-12-24">2026-12-24</time> · 作者：SnishaperTeam
            </div>
          </header>
          
          <div class="blog-content">
            <h2>引言</h2>
            <p>
              C++是一门强大的编程语言，它结合了高级编程特性和底层系统编程能力。
              从1983年由Bjarne Stroustrup发明至今，C++已经广泛应用于系统软件、游戏开发、
              嵌入式系统、高性能计算等领域。本指南将带你从零开始，逐步学习C++编程。
            </p>
            
            <h2>1. Hello World程序详解</h2>
            <p>
              学习任何编程语言的第一步都是编写Hello World程序。这不仅是传统，更是
              检查开发环境是否配置正确的有效方法。让我从一个简单的C++程序开始：
            </p>
            
            <pre><code class="language-cpp">#include &lt;iostream&gt;

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}</code></pre>
            
            <h3>1.1 代码解析</h3>
            <ul>
              <li>
                <strong>#include &lt;iostream&gt;</strong>：这是一个预处理指令，
                告诉编译器包含输入输出流库。iostream库提供了输入输出功能，
                如std::cout（输出）和std::cin（输入）。
              </li>
              <li>
                <strong>int main()</strong>：这是程序的入口点。每个C++程序
                都必须有一个main函数，操作系统从这里开始执行程序。
              </li>
              <li>
                <strong>std::cout</strong>：这是标准输出流对象，用于向屏幕
                输出文本。"std::"表示使用标准命名空间。
              </li>
              <li>
                <strong>&lt;&lt;</strong>：这是流插入操作符，用于将数据
                插入到输出流中。
              </li>
              <li>
                <strong>std::endl</strong>：这不仅输出一个换行符，还刷新
                输出缓冲区，确保内容立即显示。
              </li>
              <li>
                <strong>return 0;</strong>：表示程序正常结束。返回值0通常
                表示成功执行。
              </li>
            </ul>
            
            <h3>1.2 编译和运行</h3>
            <p>
              要编译这个程序，你需要一个C++编译器（如g++、clang++或MSVC）。
              使用命令行编译和运行：
            </p>
            
            <pre><code class="language-bash"># 编译
g++ -o hello hello.cpp

# 运行
./hello</code></pre>
            
            <h2>2. 变量和数据类型</h2>
            <p>
              C++提供了丰富的数据类型来处理不同类型的数据。了解这些类型是
              编程的基础。
            </p>
            
            <h3>2.1 基本数据类型</h3>
            <ul>
              <li><strong>int</strong>：整数类型，通常为32位</li>
              <li><strong>float</strong>：单精度浮点数</li>
              <li><strong>double</strong>：双精度浮点数</li>
              <li><strong>char</strong>：字符类型</li>
              <li><strong>bool</strong>：布尔类型（true/false）</li>
            </ul>
            
            <pre><code class="language-cpp">#include &lt;iostream&gt;
using namespace std;

int main() {
    int age = 25;
    float price = 19.99f;
    double precise = 3.141592653589793;
    char grade = 'A';
    bool isStudent = true;
    
    cout << "年龄: " << age << endl;
    cout << "价格: $" << price << endl;
    cout << "圆周率: " << precise << endl;
    cout << "等级: " << grade << endl;
    cout << "是否学生: " << isStudent << endl;
    
    return 0;
}</code></pre>
            
            <h3>2.2 变量命名规则</h3>
            <ul>
              <li>必须以字母或下划线开头</li>
              <li>不能使用C++关键字（如int、return等）</li>
              <li>区分大小写</li>
              <li>推荐使用有意义的名字</li>
            </ul>
            
            <h3>2.3 常量</h3>
            <p>
              使用const关键字声明常量，一旦初始化就不能修改：
            </p>
            
            <pre><code class="language-cpp">const int MAX_SIZE = 100;
const double PI = 3.14159;</code></pre>
            
            <h2>3. 运算符</h2>
            <p>
              C++提供了丰富的运算符来执行各种计算和操作。
            </p>
            
            <h3>3.1 算术运算符</h3>
            <ul>
              <li><strong>+</strong>：加法</li>
              <li><strong>-</strong>：减法</li>
              <li><strong>*</strong>：乘法</li>
              <li><strong>/</strong>：除法</li>
              <li><strong>%</strong>：取模（求余数）</li>
            </ul>
            
            <pre><code class="language-cpp">int a = 10, b = 3;
cout << "a + b = " << (a + b) << endl;  // 13
cout << "a - b = " << (a - b) << endl;  // 7
cout << "a * b = " << (a * b) << endl;  // 30
cout << "a / b = " << (a / b) << endl;  // 3 (整数除法)
cout << "a % b = " << (a % b) << endl;  // 1</code></pre>
            
            <h3>3.2 比较运算符</h3>
            <ul>
              <li><strong>==</strong>：相等</li>
              <li><strong>!=</strong>：不等</li>
              <li><strong>&lt;</strong>：小于</li>
              <li><strong>&gt;</strong>：大于</li>
              <li><strong>&lt;=</strong>：小于等于</li>
              <li><strong>&gt;=</strong>：大于等于</li>
            </ul>
            
            <h3>3.3 逻辑运算符</h3>
            <ul>
              <li><strong>&amp;&amp;</strong>：逻辑与</li>
              <li><strong>||</strong>：逻辑或</li>
              <li><strong>!</strong>：逻辑非</li>
            </ul>
            
            <h3>3.4 赋值运算符</h3>
            <pre><code class="language-cpp">int x = 5;      // 基本赋值
x += 3;         // 等同于 x = x + 3
x -= 2;         // 等同于 x = x - 2
x *= 4;         // 等同于 x = x * 4
x /= 2;         // 等同于 x = x / 2</code></pre>
            
            <h2>4. 控制流语句</h2>
            <p>
              控制流语句允许程序根据条件执行不同的代码块或重复执行某些代码。
            </p>
            
            <h3>4.1 if-else语句</h3>
            <pre><code class="language-cpp">int score = 85;

if (score >= 90) {
    cout << "优秀" << endl;
} else if (score >= 80) {
    cout << "良好" << endl;
} else if (score >= 70) {
    cout << "中等" << endl;
} else {
    cout << "需要努力" << endl;
}</code></pre>
            
            <h3>4.2 switch语句</h3>
            <pre><code class="language-cpp">int day = 3;
switch (day) {
    case 1:
        cout << "星期一" << endl;
        break;
    case 2:
        cout << "星期二" << endl;
        break;
    case 3:
        cout << "星期三" << endl;
        break;
    default:
        cout << "其他日子" << endl;
}</code></pre>
            
            <h3>4.3 循环语句</h3>
            <h4>4.3.1 for循环</h4>
            <pre><code class="language-cpp">// 打印0到9
for (int i = 0; i < 10; i++) {
    cout << i << " ";
}

// 打印9到0
for (int i = 9; i >= 0; i--) {
    cout << i << " ";
}</code></pre>
            
            <h4>4.3.2 while循环</h4>
            <pre><code class="language-cpp">int count = 0;
while (count < 5) {
    cout << "计数: " << count << endl;
    count++;
}</code></pre>
            
            <h4>4.3.3 do-while循环</h4>
            <pre><code class="language-cpp">int i = 0;
do {
    cout << i << " ";
    i++;
} while (i < 5);</code></pre>
            
            <h3>4.4 break和continue</h3>
            <ul>
              <li><strong>break</strong>：立即退出循环或switch语句</li>
              <li><strong>continue</strong>：跳过当前循环迭代，继续下一次迭代</li>
            </ul>
            
            <pre><code class="language-cpp">// 使用break
for (int i = 0; i < 10; i++) {
    if (i == 5) {
        break;  // 当i为5时退出循环
    }
    cout << i << " ";
}  // 输出: 0 1 2 3 4

// 使用continue
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) {
        continue;  // 跳过偶数
    }
    cout << i << " ";  // 输出: 1 3 5 7 9
}</code></pre>
            
            <h2>5. 数组</h2>
            <p>
              数组是存储相同类型元素的集合。它们在处理大量数据时非常有用。
            </p>
            
            <h3>5.1 一维数组</h3>
            <pre><code class="language-cpp">// 声明并初始化数组
int numbers[5] = {1, 2, 3, 4, 5};
double prices[3] = {19.99, 25.50, 30.00};
char vowels[5] = {'a', 'e', 'i', 'o', 'u'};

// 访问数组元素（索引从0开始）
cout << "第一个数字: " << numbers[0] << endl;  // 1
cout << "第三个数字: " << numbers[2] << endl;  // 3

// 修改数组元素
numbers[0] = 10;
cout << "修改后第一个数字: " << numbers[0] << endl;  // 10

// 遍历数组
for (int i = 0; i < 5; i++) {
    cout << numbers[i] << " ";
}</code></pre>
            
            <h3>5.2 二维数组</h3>
            <pre><code class="language-cpp">// 声明二维数组
int matrix[3][3] = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// 访问二维数组元素
cout << "matrix[0][0]: " << matrix[0][0] << endl;  // 1
cout << "matrix[1][2]: " << matrix[1][2] << endl;  // 6

// 遍历二维数组
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        cout << matrix[i][j] << " ";
    }
    cout << endl;
}</code></pre>
            
            <h3>5.3 字符串处理</h3>
            <p>
              C++提供了两种处理字符串的方式：C风格字符串和C++ string类。
            </p>
            
            <pre><code class="language-cpp">#include &lt;iostream&gt;
#include &lt;string&gt;
using namespace std;

int main() {
    // C++ string类（推荐）
    string name = "张三";
    string greeting = "Hello, " + name + "!";
    cout << greeting << endl;
    
    // 字符串长度
    cout << "姓名长度: " << name.length() << endl;
    
    // 字符串连接
    string fullName = name + " " + "李四";
    cout << "全名: " << fullName << endl;
    
    // 访问单个字符
    cout << "第一个字符: " << name[0] << endl;
    
    // 字符串比较
    if (name == "张三") {
        cout << "匹配成功!" << endl;
    }
    
    return 0;
}</code></pre>
            
            <h2>6. 函数</h2>
            <p>
              函数是执行特定任务的代码块。它们提高了代码的可重用性和可维护性。
            </p>
            
            <h3>6.1 函数定义和调用</h3>
            <pre><code class="language-cpp">#include &lt;iostream&gt;
using namespace std;

// 函数定义
int add(int a, int b) {
    return a + b;
}

// 无返回值函数
void printHello() {
    cout << "Hello from function!" << endl;
}

// 带默认参数的函数
int multiply(int x, int y = 1) {
    return x * y;
}

int main() {
    // 调用函数
    int sum = add(5, 3);
    cout << "5 + 3 = " << sum << endl;  // 8
    
    printHello();  // 输出: Hello from function!
    
    cout << multiply(5) << endl;     // 使用默认参数: 5
    cout << multiply(5, 3) << endl;  // 指定参数: 15
    
    return 0;
}</code></pre>
            
            <h3>6.2 函数参数传递</h3>
            <h4>6.2.1 按值传递</h4>
            <pre><code class="language-cpp">void modifyValue(int x) {
    x = 100;  // 只修改副本，不影响原变量
}

int main() {
    int num = 50;
    cout << "修改前: " << num << endl;  // 50
    modifyValue(num);
    cout << "修改后: " << num << endl;  // 仍然是50
    return 0;
}</code></pre>
            
            <h4>6.2.2 按引用传递</h4>
            <pre><code class="language-cpp">void modifyValue(int& x) {  // 注意&符号
    x = 100;  // 修改原变量
}

int main() {
    int num = 50;
    cout << "修改前: " << num << endl;  // 50
    modifyValue(num);
    cout << "修改后: " << num << endl;  // 100
    return 0;
}</code></pre>
            
            <h3>6.3 递归函数</h3>
            <pre><code class="language-cpp">// 计算阶乘的递归函数
int factorial(int n) {
    if (n <= 1) {
        return 1;  // 基础情况
    }
    return n * factorial(n - 1);  // 递归调用
}

int main() {
    cout << "5! = " << factorial(5) << endl;  // 120
    return 0;
}</code></pre>
            
            <h2>7. 指针</h2>
            <p>
              指针是C++中一个强大但容易混淆的概念。指针存储变量的内存地址。
            </p>
            
            <h3>7.1 指针基础</h3>
            <pre><code class="language-cpp">#include &lt;iostream&gt;
using namespace std;

int main() {
    int value = 42;
    int* ptr = &amp;value;  // ptr指向value的地址
    
    cout << "值: " << value << endl;           // 42
    cout << "地址: " << &amp;value << endl;        // value的地址
    cout << "指针值: " << ptr << endl;         // ptr存储的地址
    cout << "解引用: " << *ptr << endl;        // 通过指针访问值
    
    // 通过指针修改值
    *ptr = 100;
    cout << "修改后: " << value << endl;       // 100
    
    return 0;
}</code></pre>
            
            <h3>7.2 指针与数组</h3>
            <pre><code class="language-cpp">int arr[] = {10, 20, 30, 40, 50};
int* ptr = arr;  // 指针指向数组第一个元素

// 通过指针访问数组元素
cout << "arr[0]: " << *ptr << endl;        // 10
cout << "arr[1]: " << *(ptr + 1) << endl;  // 20
cout << "arr[2]: " << *(ptr + 2) << endl;  // 30

// 遍历数组
for (int i = 0; i < 5; i++) {
    cout << *(ptr + i) << " ";  // 等同于 arr[i]
}</code></pre>
            
            <h3>7.3 动态内存分配</h3>
            <pre><code class="language-cpp">#include &lt;iostream&gt;
using namespace std;

int main() {
    // 动态分配内存
    int* ptr = new int(42);
    cout << "动态分配的值: " << *ptr << endl;  // 42
    
    // 动态分配数组
    int size = 5;
    int* arr = new int[size];
    
    // 初始化数组
    for (int i = 0; i < size; i++) {
        arr[i] = i * i;
    }
    
    // 输出数组
    for (int i = 0; i < size; i++) {
        cout << arr[i] << " ";
    }
    
    // 释放内存
    delete ptr;
    delete[] arr;  // 注意使用delete[]释放数组
    
    return 0;
}</code></pre>
            
            <h2>8. 结构体</h2>
            <p>
              结构体(struct)是C++中定义自定义数据类型的一种方式，它允许将不同类型的数据组合在一起。
            </p>
            
            <h3>8.1 基本结构体</h3>
            <pre><code class="language-cpp">#include &lt;iostream&gt;
#include &lt;string&gt;
using namespace std;

// 定义结构体
struct Student {
    string name;
    int age;
    double gpa;
    char grade;
};

int main() {
    // 创建结构体实例
    Student s1;
    s1.name = "张三";
    s1.age = 20;
    s1.gpa = 3.75;
    s1.grade = 'A';
    
    // 访问结构体成员
    cout << "姓名: " << s1.name << endl;
    cout << "年龄: " << s1.age << endl;
    cout << "GPA: " << s1.gpa << endl;
    cout << "等级: " << s1.grade << endl;
    
    // 另一种初始化方式
    Student s2 = {"李四", 21, 3.85, 'A'};
    
    return 0;
}</code></pre>
            
            <h3>8.2 结构体数组</h3>
            <pre><code class="language-cpp">struct Book {
    string title;
    string author;
    int year;
    double price;
};

int main() {
    // 结构体数组
    Book library[3] = {
        {"C++ Primer", "Stanley Lippman", 2012, 59.99},
        {"Effective C++", "Scott Meyers", 2005, 45.50},
        {"The C++ Programming Language", "Bjarne Stroustrup", 2013, 65.00}
    };
    
    // 遍历结构体数组
    for (int i = 0; i < 3; i++) {
        cout << "书名: " << library[i].title << endl;
        cout << "作者: " << library[i].author << endl;
        cout << "年份: " << library[i].year << endl;
        cout << "价格: $" << library[i].price << endl;
        cout << "---------" << endl;
    }
    
    return 0;
}</code></pre>
            
            <h3>8.3 结构体与函数</h3>
            <pre><code class="language-cpp">struct Rectangle {
    double width;
    double height;
};

// 计算面积的函数
double calculateArea(Rectangle rect) {
    return rect.width * rect.height;
}

// 修改结构体的函数（按引用传递）
void scaleRectangle(Rectangle& rect, double factor) {
    rect.width *= factor;
    rect.height *= factor;
}

int main() {
    Rectangle r = {5.0, 3.0};
    
    cout << "面积: " << calculateArea(r) << endl;  // 15
    
    scaleRectangle(r, 2.0);
    cout << "缩放后的面积: " << calculateArea(r) << endl;  // 60
    
    return 0;
}</code></pre>
            
            <h3>8.4 结构体嵌套</h3>
            <pre><code class="language-cpp">struct Address {
    string street;
    string city;
    string state;
    int zipCode;
};

struct Person {
    string name;
    int age;
    Address address;  // 结构体作为成员
};

int main() {
    Person p = {
        "王五",
        25,
        {"123 Main St", "北京", "北京", 100001}
    };
    
    cout << "姓名: " << p.name << endl;
    cout << "地址: " << p.address.street << ", " 
         << p.address.city << ", " << p.address.state 
         << " " << p.address.zipCode << endl;
    
    return 0;
}</code></pre>
            
            <h3>8.5 typedef和结构体</h3>
            <pre><code class="language-cpp">// 为结构体定义别名
typedef struct Point {
    double x;
    double y;
} Point;

// 或者使用更现代的方式
struct Point3D {
    double x, y, z;
};

using Point3DPtr = Point3D*;  // 使用using定义别名

int main() {
    Point p = {1.0, 2.0};
    Point3D p3d = {1.0, 2.0, 3.0};
    
    Point3DPtr ptr = &p3d;  // 使用别名定义指针
    
    cout << "点 (" << p.x << ", " << p.y << ")" << endl;
    
    return 0;
}</code></pre>
            
            <h2>总结</h2>
            <p>
              本指南涵盖了C++编程的基础知识，从最简单的Hello World程序到结构体的概念。
              学习C++需要时间和实践，建议您：
            </p>
            
            <ul>
              <li>多编写代码并运行测试</li>
              <li>理解每个概念的实际应用</li>
              <li>逐步构建更复杂的程序</li>
              <li>阅读优秀的C++代码和文档</li>
              <li>实践是掌握编程语言的最好方法</li>
            </ul>
            
            <p>
              掌握了这些基础知识后，您可以继续学习更高级的主题，如类和对象、继承、
              多态、模板、STL标准库等。C++是一门功能强大的语言，掌握它将为您的
              编程生涯打开许多门。
            </p>
            
            <p>
              记住，编程是一门实践性很强的技能。不要只是阅读教程，要动手编写代码，
              尝试修改示例，创建自己的小项目。通过实践，您将更好地理解和掌握C++编程。
            </p>
          </div>
          
          <footer class="mt-5">
            <div class="d-flex justify-content-between align-items-center">
              <div class="tags">
                <span class="badge me-1" style="background-color: rgba(255, 140, 66, 0.15); color: #ff8c42;">C++</span>
                <span class="badge me-1" style="background-color: rgba(244, 140, 6, 0.15); color: #f48c06;">教程</span>
                <span class="badge" style="background-color: rgba(255, 186, 8, 0.15); color: #ffba08;">编程入门</span>
              </div>
              <router-link to="/blog" class="btn-geek" style="font-size:var(--font-size-xs);">
                <Icon icon="mdi:arrow-left" /> 返回博客列表
              </router-link>
            </div>
          </footer>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// C++完全入门指南博客页面组件
// 作者：自动创建
// 创建时间：2025-12-24
</script>
